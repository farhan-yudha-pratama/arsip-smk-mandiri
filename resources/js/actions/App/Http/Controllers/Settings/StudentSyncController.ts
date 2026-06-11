import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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

    /**
* @see \App\Http\Controllers\Settings\StudentSyncController::store
 * @see app/Http/Controllers/Settings/StudentSyncController.php:11
 * @route '/settings/get-student'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\StudentSyncController::store
 * @see app/Http/Controllers/Settings/StudentSyncController.php:11
 * @route '/settings/get-student'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const StudentSyncController = { store }

export default StudentSyncController