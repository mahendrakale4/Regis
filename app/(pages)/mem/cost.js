
const priceTable = [
    { date: 21, breakfast: 40, lunch: 60, dinner: 30 },
    { date: 22, breakfast: 40, lunch: 60, dinner: 30 },
    { date: 23, breakfast: 40, lunch: 60, dinner: 30 },
    { date: 24, breakfast: 40, lunch: 100, dinner: 30 },
    { date: 25, breakfast: 40, lunch: 90, dinner: 30 },
    { date: 26, breakfast: 40, lunch: 90, dinner: 30 },
    { date: 27, breakfast: 40, lunch: 100, dinner: 30 },
    { date: 28, breakfast: 40, lunch: 100, dinner: 30 },
    { date: 29, breakfast: 40, lunch: 100, dinner: 30 },
    { date: 30, breakfast: 40, lunch: 60, dinner: 30 },
    { date: 31, breakfast: 40, lunch: 60, dinner: 30 }
];

// cost per day for different types of accommodation
const accommodationPrices = {
    "AC": 100,
    "Non AC": 70,
    "CV Floor": 50,
};


function calculateCost(firstMealDate, firstMealType, lastMealDate, lastMealType, accommodation) {
    // Convert the dates to integers for easier comparison
    const firstDateInt = parseInt(firstMealDate.split('-')[0]);
    const lastDateInt = parseInt(lastMealDate.split('-')[0]);

    let totalCost = 0;

    // Loop through all dates in the range from firstMealDate to lastMealDate
    for (let i = firstDateInt; i <= lastDateInt; i++) {
        const meal = priceTable.find(entry => entry.date === i);
        if (meal) {
            // If it's the first day, include the cost from first meal type to dinner
            if (i === firstDateInt) {
                if (firstMealType === "Breakfast") totalCost += meal.breakfast + meal.lunch + meal.dinner;
                if (firstMealType === "Lunch") totalCost += meal.lunch + meal.dinner;
                if (firstMealType === "Dinner") totalCost += meal.dinner;
            }
            // For the last day, include the cost from breakfast till last meal type
            else if (i === lastDateInt) {
                if (lastMealType === "Breakfast") totalCost += meal.breakfast;
                if (lastMealType === "Lunch") totalCost += meal.breakfast + meal.lunch;
                if (lastMealType === "Dinner") totalCost += meal.breakfast + meal.lunch + meal.dinner;
            }
            // For days in between, include all meal types
            else {
                totalCost += meal.breakfast + meal.lunch + meal.dinner;
            }
        }
    }

    // Calculate accommodation cost for the duration (first date to last date minus 1)
    if (accommodation && accommodationPrices[accommodation]) {
        const numberOfDays = lastDateInt - firstDateInt;  // Calculate the number of days
        totalCost += accommodationPrices[accommodation] * numberOfDays;  // Multiply by daily accommodation cost
        // addiontal  Miscellaneous Charges: Rs 150
        totalCost += 150;
    }
    return totalCost;  // Move return here, outside the loop
}


export default calculateCost;
