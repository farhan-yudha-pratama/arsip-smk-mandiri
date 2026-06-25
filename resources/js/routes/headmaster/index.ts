import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\HeadmasterController::index
 * @see app/Http/Controllers/HeadmasterController.php:11
 * @route '/headmaster'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/headmaster',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HeadmasterController::index
 * @see app/Http/Controllers/HeadmasterController.php:11
 * @route '/headmaster'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HeadmasterController::index
 * @see app/Http/Controllers/HeadmasterController.php:11
 * @route '/headmaster'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HeadmasterController::index
 * @see app/Http/Controllers/HeadmasterController.php:11
 * @route '/headmaster'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HeadmasterController::store
 * @see app/Http/Controllers/HeadmasterController.php:19
 * @route '/headmaster'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/headmaster',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HeadmasterController::store
 * @see app/Http/Controllers/HeadmasterController.php:19
 * @route '/headmaster'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HeadmasterController::store
 * @see app/Http/Controllers/HeadmasterController.php:19
 * @route '/headmaster'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const headmaster = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default headmaster