<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    protected $repo;

    public function __construct(ProductRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list($filters = [])
    {
        return $this->repo->all($filters);
    }

    public function get($id)
    {
        return $this->repo->find($id);
    }

    public function create(array $data)
    {
        // Se tiver arquivo de imagem
        if (isset($data['image']) && $data['image']) {
            $path = $data['image']->store('products', 'public');
            $data['image_url'] = $path;
            unset($data['image']);
        }

        return $this->repo->create($data);
    }

    public function update($id, array $data)
    {
        if (isset($data['image']) && $data['image']) {
            $path = $data['image']->store('products', 'public');
            $data['image_url'] = $path;
            unset($data['image']);
        }

        return $this->repo->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repo->delete($id);
    }
}
