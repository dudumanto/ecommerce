<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'formatted_price' => 'R$ ' . number_format($this->price, 2, ',', '.'),
            'image_url' => $this->image_url ? \Illuminate\Support\Facades\Storage::url($this->image_url) : null,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'created_at' => $this->created_at,
        ];
    }
}
