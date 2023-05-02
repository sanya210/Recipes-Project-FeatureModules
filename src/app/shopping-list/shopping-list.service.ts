import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";


export class ShoppingListService{
    ingredientChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient('aalooo', 1),
        new Ingredient('tamatar', 10),
    ];
    getIngredirents(){
        return this.ingredients.slice();
    }
    getIngredient(index:number){
        return this.ingredients[index];
    }
    addIndegrient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientChanged.next(this.ingredients.slice());
    }
    addIngredients(ingredients: Ingredient[]){
        this.ingredients.push(...ingredients);
        this.ingredientChanged.next(ingredients.slice());
    }
    updateIngredient(index:number, newIngredient:Ingredient){
        this.ingredients[index] = newIngredient;
        this.ingredientChanged.next(this.ingredients.slice());
    }
    deleteIngredient(index:number){
        this.ingredients.splice(index,1);
        this.ingredientChanged.next(this.ingredients.slice());
    }
    
}