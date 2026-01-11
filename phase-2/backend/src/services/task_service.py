"""
Task service layer for the Task Management API.

Business logic for task operations with user-scoped data isolation.
Per data-model.md specification.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from ..models.task import Task
from ..schemas.task import TaskCreate, TaskUpdate


class TaskService:
    """Service class for task operations."""

    async def create_task(self, db_session: AsyncSession, user_id: str, task_data: TaskCreate) -> Task:
        """Create a new task for the specified user."""
        task = Task(
            user_id=user_id,
            title=task_data.title,
            description=task_data.description,
            is_completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db_session.add(task)
        await db_session.commit()
        await db_session.refresh(task)
        return task

    async def get_tasks_by_user(
        self,
        db_session: AsyncSession,
        user_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[List[Task], int]:
        """Get all tasks for the specified user with pagination."""
        # Query for tasks belonging to the user
        query = select(Task).where(Task.user_id == user_id)

        # Get total count
        count_result = await db_session.exec(query)
        all_tasks = count_result.all()
        total = len(all_tasks)

        # Apply pagination
        paginated_query = query.offset(offset).limit(limit)
        result = await db_session.exec(paginated_query)
        tasks = result.all()

        return list(tasks), total

    async def get_task_by_id(self, db_session: AsyncSession, user_id: str, task_id: UUID) -> Optional[Task]:
        """Get a specific task by ID for the specified user."""
        query = select(Task).where(Task.user_id == user_id, Task.id == task_id)
        result = await db_session.exec(query)
        return result.first()

    async def update_task(
        self,
        db_session: AsyncSession,
        user_id: str,
        task_id: UUID,
        task_data: TaskUpdate
    ) -> Optional[Task]:
        """Update a specific task for the specified user."""
        task = await self.get_task_by_id(db_session, user_id, task_id)
        if not task:
            return None

        # Update fields that are provided in the update data
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.is_completed is not None:
            task.is_completed = task_data.is_completed

        # Update the timestamp
        task.updated_at = datetime.utcnow()

        db_session.add(task)
        await db_session.commit()
        await db_session.refresh(task)
        return task

    async def delete_task(self, db_session: AsyncSession, user_id: str, task_id: UUID) -> bool:
        """Delete a specific task for the specified user."""
        task = await self.get_task_by_id(db_session, user_id, task_id)
        if not task:
            return False

        await db_session.delete(task)
        await db_session.commit()
        return True

    async def toggle_task_completion(
        self,
        db_session: AsyncSession,
        user_id: str,
        task_id: UUID
    ) -> Optional[Task]:
        """Toggle the completion status of a specific task for the specified user."""
        task = await self.get_task_by_id(db_session, user_id, task_id)
        if not task:
            return None

        # Toggle the completion status
        task.is_completed = not task.is_completed
        # Update the timestamp
        task.updated_at = datetime.utcnow()

        db_session.add(task)
        await db_session.commit()
        await db_session.refresh(task)
        return task


# Create a singleton instance
task_service = TaskService()
