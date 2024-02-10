// Function to dynamically create input fields for percentages
function createPercentageInputs(numSplits) {
    let percentagesContainer = document.getElementById('percentages-container');
    percentagesContainer.innerHTML = ""; // Clear previous inputs

    for (let i = 0; i < Math.min(numSplits - 1, 7); i++) {
        let input = document.createElement('input');
        input.type = "number";
        input.placeholder = "%";
        input.min = "0";
        input.max = "100";
        input.step = "any";
        input.id = `percentage-${i}`;
        input.style.marginRight = "5px";
        percentagesContainer.appendChild(input);
    }
}

// Function to calculate paycheck split
function calculatePaycheck() {
    try {
        // Get the user's paycheck amount
        let paycheckAmount = parseFloat(document.getElementById('paycheckAmount').value);

        // Get the number of splits
        let numSplits = parseInt(document.getElementById('numSplits').value);

        // Get percentages for the first (numSplits - 1) splits
        let percentages = [];
        for (let i = 0; i < Math.min(numSplits - 1, 7); i++) {
            let percentage = parseFloat(document.getElementById(`percentage-${i}`).value);
            percentages.push(percentage);
        }

        // Check if the sum of percentages is greater than 100
        let totalPercentage = percentages.reduce((sum, percentage) => sum + (isNaN(percentage) ? 0 : percentage), 0);
        if (totalPercentage > 100) {
            throw new Error("Total percentage exceeds 100%. Please adjust your input.");
        }

        // Calculate the remaining percentage
        let remainderPercentage = 100 - totalPercentage;

        // Add the remainder to the last split percentage
        percentages.push(remainderPercentage);

        // Calculate the split amounts
        let shares = [];
        for (let i = 0; i < numSplits; i++) {
            let percentage = isNaN(percentages[i]) ? 0 : percentages[i];
            shares.push(paycheckAmount * (percentage / 100));
        }

        // Display the results and encouraging comment using the results container
        let resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = "<strong>Paycheck Split:</strong><br>";
        shares.forEach((value, index) => {
            resultsContainer.innerHTML += `Split ${String.fromCharCode(65 + index)}: $${value.toFixed(2)}<br>`;
        });

        // Add a random friendly encouraging comment
        let encouragingComments = [
        "Great job! 🚀 You're one step closer to hit your financial goals.",
            "Fantastic! 🌈 Your budgeting skills are getting better.",
            "Keep it up! 🌟 Small financial improvements lead to big results.",
            "You're doing amazing! 🎉 Planning your finances wisely pays off.",
            "Way to go! 🌟 Your commitment to financial planning is inspiring.",
            "Impressive! 🌟 Your dedication to financial health is beginning to show.",
            "Well done! 🌟 Each step you take brings you closer to financial success.",
            "Outstanding! 🌟 Your financial planning skills keep improving.",
            "Bravo! 🌟 Your wise money management is setting you up for success.",
            // ... (rest of the encouraging comments remain the same)
        ];
        resultsContainer.innerHTML += "<br><em>" + encouragingComments[Math.floor(Math.random() * encouragingComments.length)] + "</em>";

    } catch (error) {
        if (error.message !== "User canceled the input.") {
            alert(`Oops! 😅 An unexpected error occurred: ${error}`);
        }
    }
}

// Call createPercentageInputs initially
let numSplitsInput = document.getElementById('numSplits');
numSplitsInput.addEventListener('input', function() {
    let numSplits = parseInt(numSplitsInput.value);
    createPercentageInputs(numSplits);
});