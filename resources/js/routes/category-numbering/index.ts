import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
* @see \App\Http\Controllers\CategoryNumberingController::index
 * @see app/Http/Controllers/CategoryNumberingController.php:18
 * @route '/category-numbering'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CategoryNumberingController::index
 * @see app/Http/Controllers/CategoryNumberingController.php:18
 * @route '/category-numbering'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CategoryNumberingController::index
 * @see app/Http/Controllers/CategoryNumberingController.php:18
 * @route '/category-numbering'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
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
* @see \App\Http\Controllers\CategoryNumberingController::store
 * @see app/Http/Controllers/CategoryNumberingController.php:29
 * @route '/category-numbering'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CategoryNumberingController::store
 * @see app/Http/Controllers/CategoryNumberingController.php:29
 * @route '/category-numbering'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
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
* @see \App\Http\Controllers\CategoryNumberingController::update
 * @see app/Http/Controllers/CategoryNumberingController.php:62
 * @route '/category-numbering/{categoryNumbering}'
 */
    const updateForm = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CategoryNumberingController::update
 * @see app/Http/Controllers/CategoryNumberingController.php:62
 * @route '/category-numbering/{categoryNumbering}'
 */
        updateForm.put = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
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

    /**
* @see \App\Http\Controllers\CategoryNumberingController::destroy
 * @see app/Http/Controllers/CategoryNumberingController.php:95
 * @route '/category-numbering/{categoryNumbering}'
 */
    const destroyForm = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CategoryNumberingController::destroy
 * @see app/Http/Controllers/CategoryNumberingController.php:95
 * @route '/category-numbering/{categoryNumbering}'
 */
        destroyForm.delete = (args: { categoryNumbering: number | { id: number } } | [categoryNumbering: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const categoryNumbering = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default categoryNumbering