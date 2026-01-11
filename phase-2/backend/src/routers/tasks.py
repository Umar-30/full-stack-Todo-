"""
Task router for the Task Management API.

REST API endpoints for task CRUD operations with JWT authentication.
Per contracts/openapi.yaml specification.
"""

from fastapi import APIRouter, Body, Depends, HTTPException, Path, status
from uuid import UUID

from ..auth.dependencies import ValidatedUser, get_validated_user
from ..db.session import get_session
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse
from ..services.task_service import task_service

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str = Path(..., description="User ID from path"),
    task_data: TaskCreate = Body(...),
    validated_user: ValidatedUser = Depends(get_validated_user),
    db_session = Depends(get_session)
):
    """Create a new task for the authenticated user."""
    # Create the task using the service
    task = await task_service.create_task(
        db_session=db_session,
        user_id=user_id,
        task_data=task_data
    )
    # Convert SQLModel to Pydantic response model
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.get("/")
async def get_tasks(
    user_id: str = Path(..., description="User ID from path"),
    validated_user: ValidatedUser = Depends(get_validated_user),
    limit: int = 50,
    offset: int = 0,
    db_session = Depends(get_session)
):
    """Get all tasks for the authenticated user."""
    # Get tasks using the service
    tasks, total = await task_service.get_tasks_by_user(
        db_session=db_session,
        user_id=user_id,
        limit=limit,
        offset=offset
    )
    # Convert SQLModels to Pydantic response models
    task_responses = [
        TaskResponse(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            is_completed=task.is_completed,
            created_at=task.created_at,
            updated_at=task.updated_at
        ) for task in tasks
    ]
    return {"tasks": task_responses, "total": total, "limit": limit, "offset": offset}


@router.get("/{task_id}/", response_model=TaskResponse)
async def get_task(
    user_id: str = Path(..., description="User ID from path"),
    task_id: UUID = Path(..., description="Task ID from path"),
    validated_user: ValidatedUser = Depends(get_validated_user),
    db_session = Depends(get_session)
):
    """Get a specific task for the authenticated user."""
    # Get task using the service
    task = await task_service.get_task_by_id(
        db_session=db_session,
        user_id=user_id,
        task_id=task_id
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    # Convert SQLModel to Pydantic response model
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.put("/{task_id}/", response_model=TaskResponse)
async def update_task(
    user_id: str = Path(..., description="User ID from path"),
    task_id: UUID = Path(..., description="Task ID from path"),
    task_data: TaskUpdate = Body(...),
    validated_user: ValidatedUser = Depends(get_validated_user),
    db_session = Depends(get_session)
):
    """Update a specific task for the authenticated user."""
    # Update task using the service
    task = await task_service.update_task(
        db_session=db_session,
        user_id=user_id,
        task_id=task_id,
        task_data=task_data
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    # Convert SQLModel to Pydantic response model
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.delete("/{task_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str = Path(..., description="User ID from path"),
    task_id: UUID = Path(..., description="Task ID from path"),
    validated_user: ValidatedUser = Depends(get_validated_user),
    db_session = Depends(get_session)
):
    """Delete a specific task for the authenticated user."""
    # Delete task using the service
    success = await task_service.delete_task(
        db_session=db_session,
        user_id=user_id,
        task_id=task_id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return


@router.patch("/{task_id}/complete/", response_model=TaskResponse)
async def toggle_task_completion(
    user_id: str = Path(..., description="User ID from path"),
    task_id: UUID = Path(..., description="Task ID from path"),
    validated_user: ValidatedUser = Depends(get_validated_user),
    db_session = Depends(get_session)
):
    """Toggle the completion status of a specific task for the authenticated user."""
    # Toggle task completion using the service
    task = await task_service.toggle_task_completion(
        db_session=db_session,
        user_id=user_id,
        task_id=task_id
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    # Convert SQLModel to Pydantic response model
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )
