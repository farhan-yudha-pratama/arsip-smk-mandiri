import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentController::index
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/document-incoming',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::index
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::index
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::index
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentController::index
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentController::index
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentController::index
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
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
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/documents/incoming',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const incoming = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default incoming