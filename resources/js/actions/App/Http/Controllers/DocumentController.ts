import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentController::incomingIndex
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
export const incomingIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: incomingIndex.url(options),
    method: 'get',
})

incomingIndex.definition = {
    methods: ["get","head"],
    url: '/document-incoming',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::incomingIndex
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
incomingIndex.url = (options?: RouteQueryOptions) => {
    return incomingIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::incomingIndex
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
incomingIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: incomingIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::incomingIndex
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
incomingIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: incomingIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentController::outgoingIndex
 * @see app/Http/Controllers/DocumentController.php:59
 * @route '/document-outgoing'
 */
export const outgoingIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: outgoingIndex.url(options),
    method: 'get',
})

outgoingIndex.definition = {
    methods: ["get","head"],
    url: '/document-outgoing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::outgoingIndex
 * @see app/Http/Controllers/DocumentController.php:59
 * @route '/document-outgoing'
 */
outgoingIndex.url = (options?: RouteQueryOptions) => {
    return outgoingIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::outgoingIndex
 * @see app/Http/Controllers/DocumentController.php:59
 * @route '/document-outgoing'
 */
outgoingIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: outgoingIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::outgoingIndex
 * @see app/Http/Controllers/DocumentController.php:59
 * @route '/document-outgoing'
 */
outgoingIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: outgoingIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:100
 * @route '/documents'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:100
 * @route '/documents'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:100
 * @route '/documents'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:246
 * @route '/documents/{document}/view'
 */
export const view = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:246
 * @route '/documents/{document}/view'
 */
view.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return view.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:246
 * @route '/documents/{document}/view'
 */
view.get = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:246
 * @route '/documents/{document}/view'
 */
view.head = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:265
 * @route '/documents/{document}/download'
 */
export const download = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:265
 * @route '/documents/{document}/download'
 */
download.url = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return download.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:265
 * @route '/documents/{document}/download'
 */
download.get = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:265
 * @route '/documents/{document}/download'
 */
download.head = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:286
 * @route '/documents/{document}/history/{history}/download'
 */
export const downloadHistory = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadHistory.url(args, options),
    method: 'get',
})

downloadHistory.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/history/{history}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:286
 * @route '/documents/{document}/history/{history}/download'
 */
downloadHistory.url = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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

    return downloadHistory.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace('{history}', parsedArgs.history.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:286
 * @route '/documents/{document}/history/{history}/download'
 */
downloadHistory.get = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadHistory.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:286
 * @route '/documents/{document}/history/{history}/download'
 */
downloadHistory.head = (args: { document: string | number | { id: string | number }, history: string | number | { id: string | number } } | [document: string | number | { id: string | number }, history: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadHistory.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentController::storeIncoming
 * @see app/Http/Controllers/DocumentController.php:393
 * @route '/documents/incoming'
 */
export const storeIncoming = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeIncoming.url(options),
    method: 'post',
})

storeIncoming.definition = {
    methods: ["post"],
    url: '/documents/incoming',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::storeIncoming
 * @see app/Http/Controllers/DocumentController.php:393
 * @route '/documents/incoming'
 */
storeIncoming.url = (options?: RouteQueryOptions) => {
    return storeIncoming.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::storeIncoming
 * @see app/Http/Controllers/DocumentController.php:393
 * @route '/documents/incoming'
 */
storeIncoming.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeIncoming.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::uploadSigned
 * @see app/Http/Controllers/DocumentController.php:326
 * @route '/documents/{document}/signed'
 */
export const uploadSigned = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadSigned.url(args, options),
    method: 'post',
})

uploadSigned.definition = {
    methods: ["post"],
    url: '/documents/{document}/signed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::uploadSigned
 * @see app/Http/Controllers/DocumentController.php:326
 * @route '/documents/{document}/signed'
 */
uploadSigned.url = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return uploadSigned.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::uploadSigned
 * @see app/Http/Controllers/DocumentController.php:326
 * @route '/documents/{document}/signed'
 */
uploadSigned.post = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadSigned.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::archive
 * @see app/Http/Controllers/DocumentController.php:366
 * @route '/documents/{document}/archive'
 */
export const archive = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

archive.definition = {
    methods: ["post"],
    url: '/documents/{document}/archive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::archive
 * @see app/Http/Controllers/DocumentController.php:366
 * @route '/documents/{document}/archive'
 */
archive.url = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return archive.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::archive
 * @see app/Http/Controllers/DocumentController.php:366
 * @route '/documents/{document}/archive'
 */
archive.post = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::update
 * @see app/Http/Controllers/DocumentController.php:185
 * @route '/documents/{document}'
 */
export const update = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/documents/{document}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DocumentController::update
 * @see app/Http/Controllers/DocumentController.php:185
 * @route '/documents/{document}'
 */
update.url = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return update.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::update
 * @see app/Http/Controllers/DocumentController.php:185
 * @route '/documents/{document}'
 */
update.put = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DocumentController::destroy
 * @see app/Http/Controllers/DocumentController.php:308
 * @route '/documents/{document}'
 */
export const destroy = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DocumentController::destroy
 * @see app/Http/Controllers/DocumentController.php:308
 * @route '/documents/{document}'
 */
destroy.url = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::destroy
 * @see app/Http/Controllers/DocumentController.php:308
 * @route '/documents/{document}'
 */
destroy.delete = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const DocumentController = { incomingIndex, outgoingIndex, store, view, download, downloadHistory, storeIncoming, uploadSigned, archive, update, destroy }

export default DocumentController