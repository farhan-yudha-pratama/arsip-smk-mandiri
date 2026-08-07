import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TeacherController::index
 * @see app/Http/Controllers/TeacherController.php:11
 * @route '/teachers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/teachers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeacherController::index
 * @see app/Http/Controllers/TeacherController.php:11
 * @route '/teachers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeacherController::index
 * @see app/Http/Controllers/TeacherController.php:11
 * @route '/teachers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeacherController::index
 * @see app/Http/Controllers/TeacherController.php:11
 * @route '/teachers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const teachers = {
    index: Object.assign(index, index),
}

export default teachers