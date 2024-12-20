import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import todoModel from '../../models/todo.model';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    const { title, completed } = await request.json();

    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const deletedTodo = await todoModel.findByIdAndDelete(id);

    if (!deletedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
