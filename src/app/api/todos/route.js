import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import todoModel from '../models/todo.model';

export async function GET() {
  try {
    await dbConnect();

    const todos = await todoModel.find();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const { title, completed } = await request.json();

    const newTodo = await todoModel.create({ title, completed });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
