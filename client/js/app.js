$(function () {

    var body = $('#body'), title = $('#title'), nextBtn = $('#nextBtn'), addBtn = $('#addBtn'), prevBtn = $('#prevBtn'),
        loadBtn = $('#loadBtn'), notesTable = $('#notes'), noteList = notesTable.find('tbody'), count = $('#count');

    addBtn.on('click', addNote);
    loadBtn.on('click', getNotes);
    nextBtn.on('click', getNextNotes);
    prevBtn.on('click', getPrevNotes);

    var actualSelf = 'http://localhost:8080/notes/pages?page=0&size=5';

    getTags();
    getNotes();


    function getNotes() {
        traverson
            .from(actualSelf)
            .json()
            .getResource(function (error, document) {
                if (error) {
                    console.error('Error: ' + error);
                }
                else {
                    $('<tr>').text('');
                    let notes = document._embedded.noteList;
                    addNotesToTable(notes);
                }
            });
    }

    function getNextNotes() {
        traverson
            .from(actualSelf)
            .json()
            .follow('$._links.next.href')
            .getResource(function (error, document) {
                if (error) {
                    console.error('Error: ' + error);
                }
                else {
                    noteList.text('');
                    let notes = document._embedded.noteList;
                    actualSelf = document._links.self.href;
                    addNotesToTable(notes);
                }
            });
    }

    function getPrevNotes() {
        traverson
            .from(actualSelf)
            .json()
            .follow('$._links.prev.href')
            .getResource(function (error, document) {
                if (error) {
                    console.error('Error: ' + error);
                }
                else {
                    noteList.text('');
                    let notes = document._embedded.noteList;
                    actualSelf = document._links.self.href;
                    addNotesToTable(notes);
                }
            });
    }


    function addNotesToTable(notes) {

        for (let note of notes) {
            addNoteToTable(note)
        }
    }

    function addNoteToTable(note) {
        $('<tr>')
            .data("noteId", note.id)
            //.attr("ratingId", rating.ratingId)
            .appendTo(noteList)
            .append($('<td>').text(note.id))
            .append($('<td>').text(note.title))
            .append($('<td>').text(note.body))
            .append($('<td>').text(note._links.self.href))
            .append($('<td>')
                .append($('<button>')
                    .text('Remove')
                    .addClass('btn btn-danger')
                    .on('click', removeNote)));
    }


    function getTags(id) {
        traverson
            .from(' http://localhost:8080/notes/1')
            .json()
            .follow('$._links.note-tags.href')
            .getResource(function (error, document) {
                if (error) {
                    console.error('No luck :-)')
                }
                else {
                    console.log('We have followed the path and reached the target resource.')
                    console.log(JSON.stringify(document))
                }
            });
    }

    function addNote() {

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/notes',
            data: JSON.stringify({
                title: title.val(),
                body: body.val()
            }),
            success: function (note, textStatus, request) {
                alert("note added");
               // addNoteToTable(note);
               title.val('');
               body.val('');
            },
            error: function (error) {
                console.log(error)
            },
            contentType: "application/json"
        });

    }

    function removeNote(e) {

        var row = e.target.closest('tr');
        var ratingId = $(row).data().ratingId;
        //var ratingId = $(row).attr("ratingId");

        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3456/courserater/rest/ratings/' + ratingId
        });

        var row = e.target.closest('tr');
        row.remove();
        updateCount();
        showHideTable();
        slideAlert.removeClass('collapse');
    }

});
