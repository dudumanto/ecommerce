<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{
    protected $model;

    public function __construct(Category $category)
    {
        $this->model = $category;
    }

    public function all()
    {
        return $this->model->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $category = $this->model->find($id);
        if (!$category) return null;

        $category->update($data);
        return $category;
    }

    public function delete($id)
    {
        $category = $this->model->find($id);
        if (!$category) return false;


        return $category->delete();
    }
}
