import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\DocumentCounterController::index
 * @see app/Http/Controllers/Settings/DocumentCounterController.php:12
 * @route '/settings/document-counter'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/document-counter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\DocumentCounterController::index
 * @see app/Http/Controllers/Settings/DocumentCounterController.php:12
 * @route '/settings/document-counter'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DocumentCounterController::index
 * @see app/Http/Controllers/Settings/DocumentCounterController.php:12
 * @route '/settings/document-counter'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\DocumentCounterController::index
 * @see app/Http/Controllers/Settings/DocumentCounterController.php:12
 * @route '/settings/document-counter'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\DocumentCounterController::update
 * @see app/Http/Controllers/Settings/DocumentCounterController.php:28
 * @route '/settings/document-counter'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/settings/document-counter',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\DocumentCounterController::update
 * @see app/Http/Controllers/Settings/DocumentCounterController.php:28
 * @route '/settings/document-counter'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DocumentCounterController::update
 * @see app/Http/Controllers/Settings/DocumentCounterController.php:28
 * @route '/settings/document-counter'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})
const DocumentCounterController = { index, update }

export default DocumentCounterController