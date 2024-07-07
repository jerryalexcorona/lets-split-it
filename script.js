// Function to dynamically create input fields for split names, fixed amounts, or percentages
function updateSplits() {
    let splitsContainer = document.getElementById('splits-container');
    splitsContainer.innerHTML = ""; // Clear previous inputs

    let numSplits = parseInt(document.getElementById('numSplits').value);

    if (isNaN(numSplits) || numSplits < 2 || numSplits > 10) {
        return;
    }

    for (let i = 0; i < numSplits; i++) {
        let div = document.createElement('div');
        div.classList.add('split');

        let nameLabel = document.createElement('label');
        nameLabel.textContent = `Name for Split ${i + 1}: `;
        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = `Split ${i + 1} name`;
        nameInput.classList.add('split-name');

        let label = document.createElement('label');
        if (i === numSplits - 1) {
            label.textContent = `Split ${i + 1} (Auto-allocated): `;
        } else {
            label.textContent = `Split ${i + 1}: `;
        }

        let typeSelect = document.createElement('select');
        if (i === numSplits - 1) {
            typeSelect.disabled = true; // Disable selection for the last split
        } else {
            typeSelect.innerHTML = `
                <option value="fixed">Fixed Amount ($)</option>
                <option value="percent">Percentage (%)</option>
            `;
        }

        let input = document.createElement('input');
        input.type = 'number';
        input.classList.add('split-input');
        input.placeholder = i === numSplits - 1 ? 'Auto-allocated' : 'Enter amount or percentage';
        input.disabled = i === numSplits - 1; // Disable input for the last split
        input.min = '0';
        input.step = 'any';

        typeSelect.addEventListener('change', function() {
            input.placeholder = typeSelect.value === 'fixed' ? 'Enter amount' : 'Enter percentage';
        });

        div.appendChild(nameLabel);
        div.appendChild(nameInput);
        div.appendChild(label);
        div.appendChild(typeSelect);
        div.appendChild(input);
        splitsContainer.appendChild(div);
    }
}

// Function to calculate total split
function calculateTotal() {
    try {
        // Get the user's total amount
        let totalAmount = parseFloat(document.getElementById('totalAmount').value);
        if (isNaN(totalAmount) || totalAmount <= 0) {
            throw new Error("Please enter a valid total amount.");
        }

        // Get the number of splits
        let numSplits = parseInt(document.getElementById('numSplits').value);
        if (isNaN(numSplits) || numSplits < 2 || numSplits > 10) {
            throw new Error("Please enter a valid number of splits.");
        }

        let splitsContainer = document.getElementById('splits-container');
        let splits = splitsContainer.getElementsByClassName('split');

        let totalFixedAmount = 0;
        let percentages = [];
        let results = [];

        for (let i = 0; i < splits.length - 1; i++) { // Skip the last split for now
            let name = splits[i].querySelector('.split-name').value || `Split ${i + 1}`;
            let type = splits[i].querySelector('select').value;
            let value = parseFloat(splits[i].querySelector('.split-input').value);

            if (type === 'fixed') {
                if (isNaN(value) || value < 0) {
                    throw new Error(`Please enter a valid fixed amount for ${name}.`);
                }
                totalFixedAmount += value;
                results.push({ name, type, value, amount: value });
            } else if (type === 'percent') {
                if (isNaN(value) || value < 0 || value > 100) {
                    throw new Error(`Please enter a valid percentage for ${name}.`);
                }
                percentages.push(value);
                results.push({ name, type, value });
            }
        }

        if (totalFixedAmount > totalAmount) {
            throw new Error("The total fixed amounts exceed the total amount.");
        }

        let remainingAmount = totalAmount - totalFixedAmount;
        let totalPercentage = percentages.reduce((sum, p) => sum + p, 0);

        if (totalPercentage > 100) {
            throw new Error("The total percentage exceeds 100%.");
        }

        // Calculate amounts for percentage-based splits
        let allocatedAmount = 0;
        for (let i = 0; i < results.length; i++) {
            if (results[i].type === 'percent') {
                let percentageAmount = (results[i].value / 100) * remainingAmount;
                results[i].amount = percentageAmount;
                allocatedAmount += percentageAmount;
            }
        }

        // Calculate amount for the last split
        let remainingSplitAmount = totalAmount - (totalFixedAmount + allocatedAmount);
        results.push({ name: splits[splits.length - 1].querySelector('.split-name').value || `Split ${numSplits}`, type: 'auto', amount: remainingSplitAmount });

        if (allocatedAmount + totalFixedAmount > totalAmount) {
            throw new Error("The total allocation exceeds the total amount.");
        }

        // Display the results
        let resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = "<strong>Summary of Splits:</strong><br>";
        results.forEach((split) => {
            resultsContainer.innerHTML += `${split.name}: $${split.amount.toFixed(2)}<br>`;
        });

        // Add a random encouraging comment
        let encouragingComments = [
            "Great job! 🚀 You're one step closer to hitting your financial goals.",
            "Fantastic! 🌈 Your budgeting skills are getting better.",
            "Keep it up! 🌟 Small financial improvements lead to big results.",
            "You're doing amazing! 🎉 Planning your finances wisely pays off.",
            "Way to go! 🌟 Your commitment to financial planning is inspiring.",
            "Impressive! 🌟 Your dedication to financial health is beginning to show.",
            "Well done! 🌟 Each step you take brings you closer to financial success.",
            "Outstanding! 🌟 Your financial planning skills keep improving.",
            "Bravo! 🌟 Your wise money management is setting you up for success."
        ];
        resultsContainer.innerHTML += "<br><em>" + encouragingComments[Math.floor(Math.random() * encouragingComments.length)] + "</em>";

    } catch (error) {
        alert(`Oops! 😅 An error occurred: ${error.message}`);
    }
}

// Initialize the split inputs
document.getElementById('numSplits').addEventListener('input', updateSplits);
