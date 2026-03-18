<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = \App\Models\Category::create(['name' => 'Eletrônicos']);

        for ($i = 1; $i <= 15; $i++) {
            \App\Models\Product::create([
                'name' => "Produto Exemplo $i",
                'description' => "Descrição detalhada do produto $i para teste de catálogo.",
                'price' => rand(100, 1000),
                'category_id' => $category->id,
                'image_url' => null // Ou uma URL de placeholder
            ]);
        }
    }
}
