import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:235
 * @route '/documents/{document}/history/{history}/download'
 */
export const download = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/history/{history}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:235
 * @route '/documents/{document}/history/{history}/download'
 */
download.url = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                    history: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                                history: typeof args.history === 'object'
                ? args.history.id
                : args.history,
                }

    return download.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace('{history}', parsedArgs.history.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:235
 * @route '/documents/{document}/history/{history}/download'
 */
download.get = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:235
 * @route '/documents/{document}/history/{history}/download'
 */
download.head = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:235
 * @route '/documents/{document}/history/{history}/download'
 */
    const downloadForm = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:235
 * @route '/documents/{document}/history/{history}/download'
 */
        downloadForm.get = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:235
 * @route '/documents/{document}/history/{history}/download'
 */
        downloadForm.head = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const history = {
    download: Object.assign(download, download),
}

export default history