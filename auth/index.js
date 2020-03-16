const Roles = {
    rider: "Rider", customer: "Customer", staff: "Staff", manager: "Manager"
}

async function authorizeCustomer(req, res, next) {
    if (!req.user) {
        res.status(401).send({ error: 'Must be logged in' })
    } else if (req.user.role != Roles.customer) {
        res.status(401).send({ error: 'Must a Customer' })
    } else {
        next()
    }
}

async function authorizeRider(req, res, next) {
    if (!req.user) {
        res.status(401).send({ error: 'Must be logged in' })
    } else if (req.user.role != Roles.rider) {
        res.status(401).send({ error: 'Must a Rider' })
    } else {
        next()
    }
}

async function authorizeStaff(req, res, next) {
    if (!req.user) {
        res.status(401).send({ error: 'Must be logged in' })
    } else if (req.user.role != Roles.staff) {
        res.status(401).send({ error: 'Must a Staff' })
    } else {
        next()
    }
}

async function authorizeManager(req, res, next) {
    if (!req.user) {
        res.status(401).send({ error: 'Must be logged in' })
    } else if (req.user.role != Roles.manager) {
        res.status(401).send({ error: 'Must a Manager' })
    } else {
        next()
    }
}

module.exports = { authorizeCustomer, authorizeRider, authorizeStaff, authorizeManager, Roles} 