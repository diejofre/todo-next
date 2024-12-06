import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Avoid OverwriteModelError in development
const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

export default Todo;
