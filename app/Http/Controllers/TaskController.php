<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Task::with("category")->paginate(10);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TaskRequest $request)
    {
        //
        $task = Task::create([
            'title' => $request->title,
            'body' => $request->body,
            'category_id' => $request->category_id,
        ]);
        return $task;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
        return $task;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        //
        $task->update([
            'title' => $request->title,
            'body' => $request->body,
            'category_id' => $request->category_id,
            'done' => $request->done
        ]);
        return $task;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        //
        $task->delete();
        return ['message' => 'Your task has been deleted'];
    }

    public function getTasksByCategory(Category $category){
        return $category->tasks()->with("category")->paginate(2);
    }

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTasksOrderedBy($column, $direction)
    {
        //
        return Task::with("category")->orderBy($column, $direction)->paginate(10);
    }

    public function getTasksByTerm($term){
        $tasks = Task::with("category")
            ->where('title','like','%'.$term.'%')
            ->orWhere('body','like','%'.$term.'%')
            ->orWhere('id','like','%'.$term.'%')
            ->paginate(10);
        return $tasks;
    }

}
