$(function(){
    $("#addCategory").on("click", function(){
        var categoryCount = ($(".categorySelection select").length);
        if (categoryCount < 3){
            $(".categorySelection").append('<div class="cf"></div><div class="leftCol cashbackGroup"><p>Choose a spending category </p> <select class="spendingCategory" name="spendingCategory' + (categoryCount + 1) + '" id="spendingCategory' + (categoryCount + 1) + '"><option>Spending Category ' + (categoryCount + 1) + '</option></select></div><div class="rightCol"><span>&#36</span><input type="text" class="textbox" name="spendingCategoryAmt' + (categoryCount + 1) + '" id="spendingCategoryAmt' + (categoryCount + 1) + '"></div><div class="cf"></div><div class="leftCol"><p>What was your &#37 Cash Back?</p></div><div class="rightCol"><span>&#37</span><input type="text" class="textbox" name="cashbackAmt' + (categoryCount + 1) + '" id="cashbackAmt' + (categoryCount + 1) + '"></div></div>');
            if(categoryCount === 2){
                disableButton();
            }
        }
    });

    $("#calculate").on("click", function(){
        var allInputValues = getAllInputValues();
        calculateMonthlyBalance(allInputValues);
    });

    function disableButton(){
        $("#addCategory").addClass("disabled");
    }

    function getAllInputValues(){
        var result = {};
        $.each($("input").serializeArray(), function(){
            result[this.name] = (this.value !== "") ? (this.value * 1) : 0;
        });
        return result;
    }

    function calculateMonthlyBalance(allInputValues){
        var monthlyBalance = (allInputValues["startingBalance"] + allInputValues["monthlyCharges"] - allInputValues["amtPaid"]) || 0;
        formatToOutput(monthlyBalance, $(".monthlyBalance"));

        var interestPaid = (monthlyBalance * (allInputValues["interestRate"]/100)/12) || 0;
        formatToOutput(interestPaid, $(".interestPaid"));

        var totalCashback = 0;
        for (var x = 1; x < $(".cashbackGroup").length; x++){
            totalCashback += allInputValues["spendingCategoryAmt" + x] * (allInputValues["cashbackAmt" + x]/100);
        }

        totalCashback += allInputValues["amtSpentOther"] * (allInputValues["cashbackAmtOther"]/100);
        formatToOutput(totalCashback, $(".monthlyCashback"));

        var netResult = totalCashback - interestPaid;
        formatToOutput(netResult, $(".netResult"));

        $(".paidForRewards").empty();
        $(".paidForRewards").append( (netResult < 0 ) ? ("Yes") : ("No"));

    }

    function formatToOutput(output, node){
        node.empty();
        var negativeNum = false;
        if (isNaN(output)){
            output = 0;
        }
        if (output < 0){
            negativeNum = true;
            output = Math.abs(output);
        }
        var formattedOutput = output.toFixed(2);
        formattedOutput = formattedOutput.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (negativeNum){
            formattedOutput = "(" + formattedOutput + ")";
        }
        (node).append("$" + formattedOutput);
    }

});