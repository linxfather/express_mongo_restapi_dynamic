import { User } from "./schemas/user.schema.js";
import { Product } from "./schemas/product.schema.js";
import { Cart } from "./schemas/cart.schema.js";
import { BaseModel } from "./schemas/baseModel.schema.js";
import mongoose from "mongoose";

export class apiModelsClass {
  #classes = {
    users: User,
    products: Product,
    carts: Cart
  };
  /**
   * @param {string} name 
   * @returns {BaseModel | undefined}
   */
  getClass(name) {
    return this.#classes[name];
  }
  /**
   * @param {BaseModel} mClass 
   * @param {string} path 
   */
  hasPath(mClass, path) {
    return Object.keys(mClass.schema.paths).includes(path);
  }
  getValidPathsForUpdate(mClass, invalidPaths) {
    const paths = Object.keys(mClass.schema.paths).filter(v => v !== '_id');
    const pathsFlat = [];
    for (const path of paths) {
      const newVal = path.split('.')[0];
      if (pathsFlat.includes(newVal)) continue;
      pathsFlat.push(newVal);
    }
    return invalidPaths.filter(v => pathsFlat.includes(v));
  }
  isId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}