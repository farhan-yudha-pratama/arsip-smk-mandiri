import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ArchiveReportController::index
 * @see app/Http/Controllers/ArchiveReportController.php:12
 * @route '/laporan-arsip'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/laporan-arsip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArchiveReportController::index
 * @see app/Http/Controllers/ArchiveReportController.php:12
 * @route '/laporan-arsip'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveReportController::index
 * @see app/Http/Controllers/ArchiveReportController.php:12
 * @route '/laporan-arsip'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArchiveReportController::index
 * @see app/Http/Controllers/ArchiveReportController.php:12
 * @route '/laporan-arsip'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArchiveReportController::index
 * @see app/Http/Controllers/ArchiveReportController.php:12
 * @route '/laporan-arsip'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArchiveReportController::index
 * @see app/Http/Controllers/ArchiveReportController.php:12
 * @route '/laporan-arsip'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArchiveReportController::index
 * @see app/Http/Controllers/ArchiveReportController.php:12
 * @route '/laporan-arsip'
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
* @see \App\Http\Controllers\ArchiveReportController::exportMethod
 * @see app/Http/Controllers/ArchiveReportController.php:41
 * @route '/laporan-arsip/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/laporan-arsip/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArchiveReportController::exportMethod
 * @see app/Http/Controllers/ArchiveReportController.php:41
 * @route '/laporan-arsip/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveReportController::exportMethod
 * @see app/Http/Controllers/ArchiveReportController.php:41
 * @route '/laporan-arsip/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArchiveReportController::exportMethod
 * @see app/Http/Controllers/ArchiveReportController.php:41
 * @route '/laporan-arsip/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArchiveReportController::exportMethod
 * @see app/Http/Controllers/ArchiveReportController.php:41
 * @route '/laporan-arsip/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArchiveReportController::exportMethod
 * @see app/Http/Controllers/ArchiveReportController.php:41
 * @route '/laporan-arsip/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArchiveReportController::exportMethod
 * @see app/Http/Controllers/ArchiveReportController.php:41
 * @route '/laporan-arsip/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const archive = {
    index: Object.assign(index, index),
export: Object.assign(exportMethod, exportMethod),
}

export default archive