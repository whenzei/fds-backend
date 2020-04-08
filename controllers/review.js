const db = require('../db');
const PS = require('pg-promise').PreparedStatement;

const psAddFoodReview = new PS({
    name: 'add-review',
    text: `INSERT INTO Reviews(stars, comment, date, oid)
            SELECT $1, $2, NOW(), $3
            FROM Orders
            WHERE oid = $3 AND deliveredTime IS NOT NULL`
})
const psAddRiderRating = new PS({
    name: 'add-rating',
    text: `INSERT INTO Ratings(value, date, oid)
            SELECT $1, NOW(), $2
            FROM Orders
            WHERE oid = $2 AND deliveredTime IS NOT NULL`
})

const addFoodReview = async function (review) {
    await db.none(psAddFoodReview, [review.stars, review.comment, review.oid])
}

const addRiderRating = async function (rating) {
    await db.none(psAddRiderRating, [rating.stars, rating.oid])
}

module.exports = {
    addFoodReview, addRiderRating
}