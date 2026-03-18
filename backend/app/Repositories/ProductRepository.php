<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    protected $model;

    public function __construct(Product $product)
    {
        $this->model = $product;
    }

    public function all(array $filters = [], int $perPage = 10)
    {
        return $this->model->query()
            ->with('category')
            // Filtra por categoria se houver ID
            ->when(!empty($filters['category_id']), function ($query) use ($filters) {
                $query->where('category_id', $filters['category_id']);
            })
            // Busca por nome ou descrição se houver termo de busca
            ->when(!empty($filters['search']), function ($query) use ($filters) {
                $query->where(function ($q) use ($filters) {
                    $term = "%{$filters['search']}%";
                    $q->where('name', 'like', $term)
                      ->orWhere('description', 'like', $term);
                });
            })
            ->paginate($perPage);
    }

    public function find(int $id)
    {
        return $this->model->with('category')->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $product = $this->model->find($id);
        if (!$product) return null;

        $product->update($data);
        return $product;
    }

    public function delete(int $id): bool
    {
        $product = $this->model->find($id);
        if (!$product) return false;

        return $product->delete();
    }
}
