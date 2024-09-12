// import { SelectQueryBuilder } from 'typeorm';

// SelectQueryBuilder.prototype.if = function (
//   test: boolean,
//   fn: () => SelectQueryBuilder<any>
// ) {
//   if (test) {
//     return fn.bind(this)();
//   } else {
//     return this;
//   }
// };

// declare module 'typeorm' {
//   interface SelectQueryBuilder<Entity> {
//     if(test: boolean, fn: (this: SelectQueryBuilder<Entity>) => this): this;
//   }
// }
