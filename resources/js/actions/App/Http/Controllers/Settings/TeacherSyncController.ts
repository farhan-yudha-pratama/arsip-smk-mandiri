import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\TeacherSyncController::store
 * @see app/Http/Controllers/Settings/TeacherSyncController.php:12
 * @route '/settings/get-teacher'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/get-teacher',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\TeacherSyncController::store
 * @see app/Http/Controllers/Settings/TeacherSyncController.php:12
 * @route '/settings/get-teacher'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\TeacherSyncController::store
 * @see app/Http/Controllers/Settings/TeacherSyncController.php:12
 * @route '/settings/get-teacher'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\TeacherSyncController::store
 * @see app/Http/Controllers/Settings/TeacherSyncController.php:12
 * @route '/settings/get-teacher'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\TeacherSyncController::store
 * @see app/Http/Controllers/Settings/TeacherSyncController.php:12
 * @route '/settings/get-teacher'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const TeacherSyncController = { store }

export default TeacherSyncController