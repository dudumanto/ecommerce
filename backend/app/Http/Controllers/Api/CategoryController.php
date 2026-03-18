<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CategoryService;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;



class CategoryController extends Controller
{
    protected $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    // LISTAR TODAS AS CATEGORIAS
    public function index()
    {
        $categories = $this->service->list();

        return new CategoryCollection($categories);
    }

    // MOSTRAR UMA CATEGORIA ESPECÍFICA
    public function show($id)
    {
        $category = $this->service->get($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoria não encontrada'
            ], 404);
        }
        return new CategoryResource($category);
    }

    // CRIAR UMA NOVA CATEGORIA
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $category = $this->service->create($data);

        return (new CategoryResource($category))
            ->additional([
                'success' => true,
                'message' => 'Categoria criada com sucesso'
            ]);
    }

    // ATUALIZAR UMA CATEGORIA
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $category = $this->service->update($id, $data);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoria não encontrada'
            ], 404);
        }

        return (new CategoryResource($category))
            ->additional([
                'success' => true,
                'message' => 'Categoria atualizada com sucesso'
            ]);
    }

    public function destroy($id)
    {
        if (!$this->service->delete($id)) {
            return response()->json([
                'success' => false,
                'message' => 'Categoria não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Categoria deletada com sucesso'
        ]);
    }
}
