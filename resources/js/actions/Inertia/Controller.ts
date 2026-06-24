import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-student'
 */
const Controller9071fee74892b91644211b2aa608cfc8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller9071fee74892b91644211b2aa608cfc8.url(options),
    method: 'get',
})

Controller9071fee74892b91644211b2aa608cfc8.definition = {
    methods: ["get","head"],
    url: '/settings/get-student',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-student'
 */
Controller9071fee74892b91644211b2aa608cfc8.url = (options?: RouteQueryOptions) => {
    return Controller9071fee74892b91644211b2aa608cfc8.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-student'
 */
Controller9071fee74892b91644211b2aa608cfc8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller9071fee74892b91644211b2aa608cfc8.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-student'
 */
Controller9071fee74892b91644211b2aa608cfc8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller9071fee74892b91644211b2aa608cfc8.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-teacher'
 */
const Controllerf6704014a4f613c53006964b14538689 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerf6704014a4f613c53006964b14538689.url(options),
    method: 'get',
})

Controllerf6704014a4f613c53006964b14538689.definition = {
    methods: ["get","head"],
    url: '/settings/get-teacher',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-teacher'
 */
Controllerf6704014a4f613c53006964b14538689.url = (options?: RouteQueryOptions) => {
    return Controllerf6704014a4f613c53006964b14538689.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-teacher'
 */
Controllerf6704014a4f613c53006964b14538689.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerf6704014a4f613c53006964b14538689.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/get-teacher'
 */
Controllerf6704014a4f613c53006964b14538689.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerf6704014a4f613c53006964b14538689.url(options),
    method: 'head',
})

const Controller = {
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
    '/settings/get-student': Controller9071fee74892b91644211b2aa608cfc8,
    '/settings/get-teacher': Controllerf6704014a4f613c53006964b14538689,
}

export default Controller