<script type="text/javascript">

    var FirstPmtDt;
    var CurrentPmtDt;
    var PaymentAmt;
    var pmts;
    var freq;

    function FillTable() {
        $("#APRSpan").html("");
        $("#APRDiv").hide();
        //$("#btnGetAPR").show();

        $("#pmtsTable tr").remove();

        pmts = parseInt($("#Payments").val())
        if (isNaN(pmts)) {
            return;
        }

        FirstPmtDt = $("#FirstPaymentDate").val();
        CurrentPmtDt = FirstPmtDt;
        PaymentAmt = $("#PaymentAmount").val();

        freq = parseFloat($("#Frequency").val());
        if (isNaN(freq)) {
            return;
        }

        TableHeader();
        AppendToTable(1, CurrentPmtDt, PaymentAmt)
        for (i = 1; i < pmts; i++) {
            getNextDate(FirstPmtDt, CurrentPmtDt, freq, i + 1);
        }
        TableFooter();

        $('html, body').animate({
            scrollTop: $("#btnGetAPR").offset().top - 50
        }, 1500);

    }

    function TableHeader() {
        tbltxt = '<tr><th style="text-align:center;">Payment Date</th>';
        tbltxt += '<th style="text-align:center;">Payment Amount</th></tr>';
        $("#pmtsTable").append(tbltxt);

    }

    function TableFooter() {
        tbltxt = '<tr><td colspan="2" style="text-align:center"><input type="submit" id="btnGetAPR" name="btnGetAPR value="Get APR" onclick="return executeRecaptcha()">';
        $("#pmtsTable").append(tbltxt);

    }

    function AppendToTable(i, cpd, pa) {
        tbltxt = '<tr><td style="text-align:center;"><input name="PaymentDate' + i + '" id="PaymentDate' + i + '" value="' + cpd + '"></td>';
        tbltxt += '<td style="text-align:center;"><input name="PaymentAmount' + i + '" id="PaymentAmount' + i + '" value="' + pa + '"></td></tr>';
        $("#pmtsTable").append(tbltxt);
        $("#PaymentDate" + i).datepicker();
    }

    function getNextDate(firstdt, dt, freq, item) {
        $.ajax({
            url: "APRAjax.asp",
            data: {
                type: 'GetNextDate',
                FirstDate: firstdt,
                BaseDate: dt,
                Frequency: freq,
                Token: 'dkz2fhty'
                
            },
            success: function (j) {
                if (j.substring(0, 5) != "Error") {
                    //console.log("Next pmt dt: " + j)
                    CurrentPmtDt = j;
                    AppendToTable(item, CurrentPmtDt, PaymentAmt);
                }
            },

            async: false
        });

    }

    $(function () {
        $("#LoanDate").datepicker();
        $("#FirstPaymentDate").datepicker();
    });

    function getAPR() {
        var PaymentsString = "";
        for (i = 1; i < pmts + 1; i++) {
            if (PaymentsString == "") {
                PaymentsString = $("#PaymentDate" + i).val() + "::" + $("#PaymentAmount" + i).val();
            }
            else {
                PaymentsString += "||" + $("#PaymentDate" + i).val() + "::" + $("#PaymentAmount" + i).val();
            }
        }
        //console.log(PaymentsString);

        $.ajax({
            url: "APRAjax.asp",
            data: {
                type: 'GetAPR',
                Payments: PaymentsString,
                AmountFinanced: $("#AmountFinanced").val(),
                LoanDate: $("#LoanDate").val(),
                Token: 'dkz2fhty'
            },
            success: function (j) {
                if (j.substring(0, 5) != "Error") {
                    //console.log(j);
                    var aprrslt = j.split("::");
                    //console.log(aprrslt[0]);
                    $("#APRSpan").html(aprrslt[0] + "%");
                    $("#u_p").html(aprrslt[1])
                    $("#APRDiv").show();
                    $('html, body').animate({
                        scrollTop: $("#APRDiv").offset().top -50
                    }, 1000);
                    //$("#btnGetAPR").hide();
                }
                else {
                    $("#APRSpan").html("Error");
                    $("#APRDiv").show();
                }

            },

            async: false
        });

    }

    function onSubmit(token) {
        //alert(grecaptcha.getResponse());
        //console.log("Submitting form");
        //return false;
        $("#btnGetAPR").click();
    }

    function executeRecaptcha() {
        if (grecaptcha.getResponse() == "") {
            grecaptcha.execute();
            return false;
        }
        else {
            return true;
        }

    }
</script>
