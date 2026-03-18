<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'success' => true,
            'data' => ProductResource::collection($this->collection),
        ];
    }

    public function with($request)
    {
        return [
            'meta' => [
                'current_page' => $this->resource->currentPage(),
                'last_page' => $this->resource->lastPage(),
                'per_page' => $this->resource->perPage(),
                'total' => $this->resource->total(),
            ]
        ];
    }

    public function paginationInformation($request, $paginated, $default)
    {
        return [];
    }
}
