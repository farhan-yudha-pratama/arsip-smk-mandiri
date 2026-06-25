import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CategoryNumberingController::index
 * @see app/Http/Controllers/CategoryNumberingController.php:18
 * @route '/category-numbering'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/category-numbering',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoryNumberingController::index
 * @see app/Http/Controllers/CategoryNumberingController.php:18
 * @route '/category-numbering'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryNumberingController::index
 * @see app/Http/Controllers/CategoryNumberingController.php:18
 * @route '/category-numbering'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CategoryNumberingController::index
 * @see app/Http/Controllers/CategoryNumberingController.php:18
 * @route '/category-numbering'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoryNumberingController::store
 * @see app/Http/Controllers/CategoryNumberingController.php:29
 * @route '/category-numbering'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/category-numbering',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoryNumberingController::store
 * @see app/Http/Controllers/CategoryNumberingController.php:29
 * @route '/category-numbering'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryNumberingController::store
 * @see app/Http/Controllers/CategoryNumberingController.php:29
 * @route '/category-numbering'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoryNumberingController::update
 * @see app/Http/Controllers/CategoryNumberingController.php:62
 * @route '/category-numbering/{categoryNumbering}'
 */
export const update = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/category-numbering/{categoryNumbering}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CategoryNumberingController::update
 * @see app/Http/Controllers/CategoryNumberingController.php:62
 * @route '/category-numbering/{categoryNumbering}'
 */
update.url = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoryNumbering: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { categoryNumbering: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    categoryNumbering: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoryNumbering: typeof args.categoryNumbering === 'object'
                ? args.categoryNumbering.id
                : args.categoryNumbering,
                }

    return update.definition.url
            .replace('{categoryNumbering}', parsedArgs.categoryNumbering.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryNumberingController::update
 * @see app/Http/Controllers/CategoryNumberingController.php:62
 * @route '/category-numbering/{categoryNumbering}'
 */
update.put = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CategoryNumberingController::destroy
 * @see app/Http/Controllers/CategoryNumberingController.php:95
 * @route '/category-numbering/{categoryNumbering}'
 */
export const destroy = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/category-numbering/{categoryNumbering}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CategoryNumberingController::destroy
 * @see app/Http/Controllers/CategoryNumberingController.php:95
 * @route '/category-numbering/{categoryNumbering}'
 */
destroy.url = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoryNumbering: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { categoryNumbering: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    categoryNumbering: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoryNumbering: typeof args.categoryNumbering === 'object'
                ? args.categoryNumbering.id
                : args.categoryNumbering,
                }

    return destroy.definition.url
            .replace('{categoryNumbering}', parsedArgs.categoryNumbering.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryNumberingController::destroy
 * @see app/Http/Controllers/CategoryNumberingController.php:95
 * @route '/category-numbering/{categoryNumbering}'
 */
destroy.delete = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const CategoryNumberingController = { index, store, update, destroy }

export default CategoryNumberingController