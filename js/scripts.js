$(document).ready(function() {
    $('#registry').on('input', convertArray);
    $('#search').on('input', search);
    $('#accuracySlider').on('input', changeAccuracy);
    changeAccuracy();
});

function changeAccuracy() {
    let accuracyVal = $('#accuracySlider').val();

    let badge = 'badge-primary';
    if (accuracyVal <= 0.2) {
        badge = 'badge-success';
    } else if (accuracyVal >= 0.6) {
        badge = 'badge-danger';
    }

    $('#range').text(accuracyVal);
    $('#range').removeClass().addClass(`badge ${badge}`);
    $('#search').trigger('input');
}

const fuse = new Fuse([], {
    keys: [
        "fl",
        'lf'
    ],
    includeScore: true
});

function convertArray(e) {
    let registryArray = [];
    registryArray = [];
    registryArray = $(e.target).val().split(/\r?\n/);

    let flRegistryArray = [];

    registryArray.forEach(e => {
        rId = null;

        tabSplit = e.split('\t');
        if (!isNaN(tabSplit[0])) {
            rId = tabSplit[0];
            searchString = tabSplit[1];
        } else {
            searchString = e;
        }

        splitArray = e.split(' ');

        lf = splitArray[1] + " " + splitArray[0];

        flRegistryArray.push({
            "fl": searchString,
            "lf": lf,
            "rid": rId
        })
    })
    fuse.setCollection(flRegistryArray);
}

const spinner = "<div><center><div class='spinner-border' role='status'><span class='sr-only'>Loading...</span></div></center></div>";

function search(e) {
    searchArray = [];
    searchArray = $(e.target).val().split(/\r?\n/);

    $('#results').empty();

    if ($(e.target).val()) {
        searchArray.forEach(e => {
            $resultDiv = $("<div class='card'>");
            $resultDiv.append(`<div class='card-header'>${e}`);
            $resultsUl = $("<ul class='list-group list-group-flush'>");

            fuseSearch = fuse.search(e);
            fuseSearch.forEach(e => {
                score = e.score.toFixed(2);

                if (score <= $('#accuracySlider').val()) {
                    pill = 'primary';
                    if (score <= 0.2) {
                        pill = 'success';
                    } else if (score >= 0.6) {
                        pill = 'danger';
                    }

                    regId = '';
                    if (e.item.rid) {
                        regId = ` <span class='badge badge-warning'>[${e.item.rid}]</span> `;
                    }

                    $resultsUl.append(`
                        <li class="list-group-item">
                            <span class="badge badge-warning">${e.refIndex+1}</span>${regId}
                            ${e.item.fl}
                            <span class="badge badge-${pill}">${score}</span>
                        </li>
                    `);
                }

            })

            $resultDiv.append($resultsUl);

            $('#results').append($resultDiv).append('<br>');
        });
    }
}
