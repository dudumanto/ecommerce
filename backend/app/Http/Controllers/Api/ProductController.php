<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;

class ProductController extends Controller
{
    protected $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }


    public function index(Request $request)
    {
        $products = $this->service->list($request->only(['category_id', 'search']));

        return new ProductCollection($products);
    }

    public function show($id)
    {
        $product = $this->service->get($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produto não encontrado'
            ], 404);
        }

        return new ProductResource($product);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048'
        ]);


        $product = $this->service->create($data);

        return (new ProductResource($product))
            ->additional([
                'success' => true,
                'message' => 'Produto criado com sucesso'
            ]);
    }


    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'category_id' => 'sometimes|exists:categories,id',
            'image' => 'nullable|image|max:2048'
        ]);


        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('products', 'public');
        }

        $product = $this->service->update($id, $data);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produto não encontrado'
            ], 404);
        }

        return (new ProductResource($product))
            ->additional([
                'success' => true,
                'message' => 'Produto atualizado com sucesso'
            ]);
    }


    public function destroy($id)
    {
        if (!$this->service->delete($id)) {
            return response()->json([
                'success' => false,
                'message' => 'Produto não encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produto deletado com sucesso'
        ]);
    }
}
