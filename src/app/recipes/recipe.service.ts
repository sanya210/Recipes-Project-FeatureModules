import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe('Tasty Schnitzel',
    'A super-tasty Schnitzel',
    'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
    [
    new Ingredient('Meat',1),
    new Ingredient('French Fries',20)
    ]),
    new Recipe('Big Fat Burger',
                'Huh!',
                'https://upload.wikimedia.org/wikipedia/commons/e/e2/Simpson_Burger%2C_XV_Burger%2C_Montparnasse%2C_Paris_002.jpg',
                [
                new Ingredient('Buns',2),
                new Ingredient('Meat',3)
                ])
];

  constructor(private slService: ShoppingListService) {}

  //receiving recipe array as parameter from fetchData method of header component class
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());//emitting an event when recipes changed and this will be subscribed by recipe-list
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
