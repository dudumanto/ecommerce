<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'success' => true,
            'data' => CategoryResource::collection($this->collection),
        ];
    }
}
