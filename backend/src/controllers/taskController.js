import Task from '../models/Task.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json(new ApiResponse({ statusCode: 201, message: 'Task created', data: task }));
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json(new ApiResponse({ statusCode: 404, message: 'Task not found' }));
  res.json(new ApiResponse({ data: task }));
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true }
  );
  if (!task) return res.status(404).json(new ApiResponse({ statusCode: 404, message: 'Task not found' }));
  res.json(new ApiResponse({ message: 'Task updated', data: task }));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json(new ApiResponse({ statusCode: 404, message: 'Task not found' }));
  res.json(new ApiResponse({ message: 'Task deleted' }));
});

export const listTasks = asyncHandler(async (req, res) => {
  const {
    q,
    status,
    priority,
    tag,
    dueFrom,
    dueTo,
    sortBy = 'createdAt:desc',
    page = 1,
    limit = 10
  } = req.query;

  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (tag) filter.tags = tag;
  if (dueFrom || dueTo) {
    filter.dueDate = {};
    if (dueFrom) filter.dueDate.$gte = new Date(dueFrom);
    if (dueTo) filter.dueDate.$lte = new Date(dueTo);
  }
  if (q) filter.$text = { $search: q };

  const [sortField, sortOrder] = sortBy.split(':');
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Task.countDocuments(filter)
  ]);

  res.json(
    new ApiResponse({
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    })
  );
});
