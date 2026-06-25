import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\DocumentController::incomingIndex
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
    const incomingIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: incomingIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentController::incomingIndex
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
        incomingIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: incomingIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentController::incomingIndex
 * @see app/Http/Controllers/DocumentController.php:36
 * @route '/document-incoming'
 */
        incomingIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: incomingIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    incomingIndex.form = incomingIndexForm
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
* @see \App\Http\Controllers\DocumentController::outgoingIndex
 * @see app/Http/Controllers/DocumentController.php:59
 * @route '/document-outgoing'
 */
    const outgoingIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: outgoingIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentController::outgoingIndex
 * @see app/Http/Controllers/DocumentController.php:59
 * @route '/document-outgoing'
 */
        outgoingIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: outgoingIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentController::outgoingIndex
 * @see app/Http/Controllers/DocumentController.php:59
 * @route '/document-outgoing'
 */
        outgoingIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: outgoingIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    outgoingIndex.form = outgoingIndexForm
/**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:96
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
 * @see app/Http/Controllers/DocumentController.php:96
 * @route '/documents'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:96
 * @route '/documents'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:96
 * @route '/documents'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentController::store
 * @see app/Http/Controllers/DocumentController.php:96
 * @route '/documents'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:242
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
 * @see app/Http/Controllers/DocumentController.php:242
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
 * @see app/Http/Controllers/DocumentController.php:242
 * @route '/documents/{document}/view'
 */
view.get = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:242
 * @route '/documents/{document}/view'
 */
view.head = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:242
 * @route '/documents/{document}/view'
 */
    const viewForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:242
 * @route '/documents/{document}/view'
 */
        viewForm.get = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentController::view
 * @see app/Http/Controllers/DocumentController.php:242
 * @route '/documents/{document}/view'
 */
        viewForm.head = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:261
 * @route '/documents/{document}/download'
 */
export const download = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:261
 * @route '/documents/{document}/download'
 */
download.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/DocumentController.php:261
 * @route '/documents/{document}/download'
 */
download.get = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:261
 * @route '/documents/{document}/download'
 */
download.head = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:261
 * @route '/documents/{document}/download'
 */
    const downloadForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:261
 * @route '/documents/{document}/download'
 */
        downloadForm.get = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentController::download
 * @see app/Http/Controllers/DocumentController.php:261
 * @route '/documents/{document}/download'
 */
        downloadForm.head = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:282
 * @route '/documents/{document}/history/{history}/download'
 */
export const downloadHistory = (args: { document: string | { id: string }, history: number | { id: number } } | [document: string | { id: string }, history: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadHistory.url(args, options),
    method: 'get',
})

downloadHistory.definition = {
    methods: ["get","head"],
    url: '/documents/{document}/history/{history}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:282
 * @route '/documents/{document}/history/{history}/download'
 */
downloadHistory.url = (args: { document: string | { id: string }, history: number | { id: number } } | [document: string | { id: string }, history: number | { id: number } ], options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/DocumentController.php:282
 * @route '/documents/{document}/history/{history}/download'
 */
downloadHistory.get = (args: { document: string | { id: string }, history: number | { id: number } } | [document: string | { id: string }, history: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadHistory.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:282
 * @route '/documents/{document}/history/{history}/download'
 */
downloadHistory.head = (args: { document: string | { id: string }, history: number | { id: number } } | [document: string | { id: string }, history: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadHistory.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:282
 * @route '/documents/{document}/history/{history}/download'
 */
    const downloadHistoryForm = (args: { document: string | { id: string }, history: number | { id: number } } | [document: string | { id: string }, history: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadHistory.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:282
 * @route '/documents/{document}/history/{history}/download'
 */
        downloadHistoryForm.get = (args: { document: string | { id: string }, history: number | { id: number } } | [document: string | { id: string }, history: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadHistory.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentController::downloadHistory
 * @see app/Http/Controllers/DocumentController.php:282
 * @route '/documents/{document}/history/{history}/download'
 */
        downloadHistoryForm.head = (args: { document: string | { id: string }, history: number | { id: number } } | [document: string | { id: string }, history: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadHistory.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadHistory.form = downloadHistoryForm
/**
* @see \App\Http\Controllers\DocumentController::storeIncoming
 * @see app/Http/Controllers/DocumentController.php:389
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
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
storeIncoming.url = (options?: RouteQueryOptions) => {
    return storeIncoming.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::storeIncoming
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
storeIncoming.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeIncoming.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DocumentController::storeIncoming
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
    const storeIncomingForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeIncoming.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentController::storeIncoming
 * @see app/Http/Controllers/DocumentController.php:389
 * @route '/documents/incoming'
 */
        storeIncomingForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeIncoming.url(options),
            method: 'post',
        })
    
    storeIncoming.form = storeIncomingForm
/**
* @see \App\Http\Controllers\DocumentController::uploadSigned
 * @see app/Http/Controllers/DocumentController.php:322
 * @route '/documents/{document}/signed'
 */
export const uploadSigned = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadSigned.url(args, options),
    method: 'post',
})

uploadSigned.definition = {
    methods: ["post"],
    url: '/documents/{document}/signed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::uploadSigned
 * @see app/Http/Controllers/DocumentController.php:322
 * @route '/documents/{document}/signed'
 */
uploadSigned.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/DocumentController.php:322
 * @route '/documents/{document}/signed'
 */
uploadSigned.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadSigned.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DocumentController::uploadSigned
 * @see app/Http/Controllers/DocumentController.php:322
 * @route '/documents/{document}/signed'
 */
    const uploadSignedForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadSigned.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentController::uploadSigned
 * @see app/Http/Controllers/DocumentController.php:322
 * @route '/documents/{document}/signed'
 */
        uploadSignedForm.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadSigned.url(args, options),
            method: 'post',
        })
    
    uploadSigned.form = uploadSignedForm
/**
* @see \App\Http\Controllers\DocumentController::archive
 * @see app/Http/Controllers/DocumentController.php:362
 * @route '/documents/{document}/archive'
 */
export const archive = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

archive.definition = {
    methods: ["post"],
    url: '/documents/{document}/archive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::archive
 * @see app/Http/Controllers/DocumentController.php:362
 * @route '/documents/{document}/archive'
 */
archive.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/DocumentController.php:362
 * @route '/documents/{document}/archive'
 */
archive.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DocumentController::archive
 * @see app/Http/Controllers/DocumentController.php:362
 * @route '/documents/{document}/archive'
 */
    const archiveForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: archive.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentController::archive
 * @see app/Http/Controllers/DocumentController.php:362
 * @route '/documents/{document}/archive'
 */
        archiveForm.post = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: archive.url(args, options),
            method: 'post',
        })
    
    archive.form = archiveForm
/**
* @see \App\Http\Controllers\DocumentController::update
 * @see app/Http/Controllers/DocumentController.php:181
 * @route '/documents/{document}'
 */
export const update = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/documents/{document}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DocumentController::update
 * @see app/Http/Controllers/DocumentController.php:181
 * @route '/documents/{document}'
 */
update.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/DocumentController.php:181
 * @route '/documents/{document}'
 */
update.put = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DocumentController::update
 * @see app/Http/Controllers/DocumentController.php:181
 * @route '/documents/{document}'
 */
    const updateForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentController::update
 * @see app/Http/Controllers/DocumentController.php:181
 * @route '/documents/{document}'
 */
        updateForm.put = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\DocumentController::destroy
 * @see app/Http/Controllers/DocumentController.php:304
 * @route '/documents/{document}'
 */
export const destroy = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DocumentController::destroy
 * @see app/Http/Controllers/DocumentController.php:304
 * @route '/documents/{document}'
 */
destroy.url = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/DocumentController.php:304
 * @route '/documents/{document}'
 */
destroy.delete = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DocumentController::destroy
 * @see app/Http/Controllers/DocumentController.php:304
 * @route '/documents/{document}'
 */
    const destroyForm = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentController::destroy
 * @see app/Http/Controllers/DocumentController.php:304
 * @route '/documents/{document}'
 */
        destroyForm.delete = (args: { document: string | { id: string } } | [document: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const DocumentController = { incomingIndex, outgoingIndex, store, view, download, downloadHistory, storeIncoming, uploadSigned, archive, update, destroy }

export default DocumentController