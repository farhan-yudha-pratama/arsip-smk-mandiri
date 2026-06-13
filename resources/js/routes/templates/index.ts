import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TemplateController::index
 * @see app/Http/Controllers/TemplateController.php:20
 * @route '/templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TemplateController::index
 * @see app/Http/Controllers/TemplateController.php:20
 * @route '/templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TemplateController::index
 * @see app/Http/Controllers/TemplateController.php:20
 * @route '/templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TemplateController::index
 * @see app/Http/Controllers/TemplateController.php:20
 * @route '/templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TemplateController::index
 * @see app/Http/Controllers/TemplateController.php:20
 * @route '/templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TemplateController::index
 * @see app/Http/Controllers/TemplateController.php:20
 * @route '/templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TemplateController::index
 * @see app/Http/Controllers/TemplateController.php:20
 * @route '/templates'
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
* @see \App\Http\Controllers\TemplateController::store
 * @see app/Http/Controllers/TemplateController.php:46
 * @route '/templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TemplateController::store
 * @see app/Http/Controllers/TemplateController.php:46
 * @route '/templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TemplateController::store
 * @see app/Http/Controllers/TemplateController.php:46
 * @route '/templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TemplateController::store
 * @see app/Http/Controllers/TemplateController.php:46
 * @route '/templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TemplateController::store
 * @see app/Http/Controllers/TemplateController.php:46
 * @route '/templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TemplateController::extractVariables
 * @see app/Http/Controllers/TemplateController.php:176
 * @route '/templates/extract-variables'
 */
export const extractVariables = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extractVariables.url(options),
    method: 'post',
})

extractVariables.definition = {
    methods: ["post"],
    url: '/templates/extract-variables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TemplateController::extractVariables
 * @see app/Http/Controllers/TemplateController.php:176
 * @route '/templates/extract-variables'
 */
extractVariables.url = (options?: RouteQueryOptions) => {
    return extractVariables.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TemplateController::extractVariables
 * @see app/Http/Controllers/TemplateController.php:176
 * @route '/templates/extract-variables'
 */
extractVariables.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extractVariables.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TemplateController::extractVariables
 * @see app/Http/Controllers/TemplateController.php:176
 * @route '/templates/extract-variables'
 */
    const extractVariablesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: extractVariables.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TemplateController::extractVariables
 * @see app/Http/Controllers/TemplateController.php:176
 * @route '/templates/extract-variables'
 */
        extractVariablesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: extractVariables.url(options),
            method: 'post',
        })
    
    extractVariables.form = extractVariablesForm
/**
* @see \App\Http\Controllers\TemplateController::update
 * @see app/Http/Controllers/TemplateController.php:110
 * @route '/templates/{template}'
 */
export const update = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/templates/{template}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TemplateController::update
 * @see app/Http/Controllers/TemplateController.php:110
 * @route '/templates/{template}'
 */
update.url = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TemplateController::update
 * @see app/Http/Controllers/TemplateController.php:110
 * @route '/templates/{template}'
 */
update.post = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TemplateController::update
 * @see app/Http/Controllers/TemplateController.php:110
 * @route '/templates/{template}'
 */
    const updateForm = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TemplateController::update
 * @see app/Http/Controllers/TemplateController.php:110
 * @route '/templates/{template}'
 */
        updateForm.post = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\TemplateController::destroy
 * @see app/Http/Controllers/TemplateController.php:132
 * @route '/templates/{template}'
 */
export const destroy = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/templates/{template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TemplateController::destroy
 * @see app/Http/Controllers/TemplateController.php:132
 * @route '/templates/{template}'
 */
destroy.url = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return destroy.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TemplateController::destroy
 * @see app/Http/Controllers/TemplateController.php:132
 * @route '/templates/{template}'
 */
destroy.delete = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TemplateController::destroy
 * @see app/Http/Controllers/TemplateController.php:132
 * @route '/templates/{template}'
 */
    const destroyForm = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TemplateController::destroy
 * @see app/Http/Controllers/TemplateController.php:132
 * @route '/templates/{template}'
 */
        destroyForm.delete = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\TemplateController::preview
 * @see app/Http/Controllers/TemplateController.php:145
 * @route '/templates/{template}/preview'
 */
export const preview = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/templates/{template}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TemplateController::preview
 * @see app/Http/Controllers/TemplateController.php:145
 * @route '/templates/{template}/preview'
 */
preview.url = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return preview.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TemplateController::preview
 * @see app/Http/Controllers/TemplateController.php:145
 * @route '/templates/{template}/preview'
 */
preview.get = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TemplateController::preview
 * @see app/Http/Controllers/TemplateController.php:145
 * @route '/templates/{template}/preview'
 */
preview.head = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TemplateController::preview
 * @see app/Http/Controllers/TemplateController.php:145
 * @route '/templates/{template}/preview'
 */
    const previewForm = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TemplateController::preview
 * @see app/Http/Controllers/TemplateController.php:145
 * @route '/templates/{template}/preview'
 */
        previewForm.get = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TemplateController::preview
 * @see app/Http/Controllers/TemplateController.php:145
 * @route '/templates/{template}/preview'
 */
        previewForm.head = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\TemplateController::download
 * @see app/Http/Controllers/TemplateController.php:161
 * @route '/templates/{template}/download'
 */
export const download = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/templates/{template}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TemplateController::download
 * @see app/Http/Controllers/TemplateController.php:161
 * @route '/templates/{template}/download'
 */
download.url = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return download.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TemplateController::download
 * @see app/Http/Controllers/TemplateController.php:161
 * @route '/templates/{template}/download'
 */
download.get = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TemplateController::download
 * @see app/Http/Controllers/TemplateController.php:161
 * @route '/templates/{template}/download'
 */
download.head = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TemplateController::download
 * @see app/Http/Controllers/TemplateController.php:161
 * @route '/templates/{template}/download'
 */
    const downloadForm = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TemplateController::download
 * @see app/Http/Controllers/TemplateController.php:161
 * @route '/templates/{template}/download'
 */
        downloadForm.get = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TemplateController::download
 * @see app/Http/Controllers/TemplateController.php:161
 * @route '/templates/{template}/download'
 */
        downloadForm.head = (args: { template: string | { id: string } } | [template: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const templates = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
extractVariables: Object.assign(extractVariables, extractVariables),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
preview: Object.assign(preview, preview),
download: Object.assign(download, download),
}

export default templates