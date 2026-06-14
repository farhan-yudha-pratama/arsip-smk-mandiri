import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\StudentSyncController::store
 * @see app/Http/Controllers/Settings/StudentSyncController.php:11
 * @route '/settings/get-student'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/get-student',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\StudentSyncController::store
 * @see app/Http/Controllers/Settings/StudentSyncController.php:11
 * @route '/settings/get-student'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\StudentSyncController::store
 * @see app/Http/Controllers/Settings/StudentSyncController.php:11
 * @route '/settings/get-student'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const StudentSyncController = { store }

export default StudentSyncController