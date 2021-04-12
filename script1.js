try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');
var noteContent = '';
var notes = getAllNotes();
renderNotes(notes);
recognition.continuous = true;

recognition.onresult = function(event) {

  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;
    if(transcript=="launch docker")
    {
      window.location.href='http://192.168.43.206/docker.html';
    }
    else if(transcript=="show my ip")
    {
      window.location.href='http://192.168.43.206/cgi-bin/checkIP.py';
    }
    else if(transcript=="run date")
    {
      window.location.href='http://192.168.43.206/cgi-bin/date.py';
    }
    else if(transcript=="run calendar")
    {
      window.location.href='http://192.168.43.206/cgi-bin/cal.py';
    }
    else if(transcript=="add user")
    {
      window.location.href='http://192.168.43.206/user.html';
    }
    else if(transcript=="add group")
    {
      window.location.href='http://192.168.43.206/groupadd.html';
    }
    else if(transcript=="choose a service")
    {
      window.location.href='http://192.168.43.206/service.html';
    }
    else if(transcript=="stop service")
    {
      window.location.href='http://192.168.43.206/stopservice.html';
    }
    else if(transcript=="setup hadoop")
    {
      window.location.href='http://192.168.43.206/cgi-bin/hadoop_automate.html';
    }
    else if(transcript=="launch ec2")
    {
      window.location.href='http://192.168.43.206/cgi-bin/ec2.py';
    }
    else if(transcript=="make folder")
    {
      window.location.href='http://192.168.43.206/mkdir.html';
    }
    else if(transcript=="set ip")
    {
      window.location.href='http://192.168.43.206/ip.html';
    }
    else if(transcript=="install basic software")
    {
      window.location.href='http://192.168.43.206/install_soft.html';
    }
  
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function() { 
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}

$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();

});


$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

noteTextarea.on('input', function() {
  noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
  recognition.stop();

  if(!noteContent.length) {
    instructions.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    saveNote(new Date().toLocaleString(), noteContent);
    noteContent = '';
    renderNotes(getAllNotes());
    noteTextarea.val('');
    instructions.text('Note saved successfully.');
  }
      
})


notesList.on('click', function(e) {
  e.preventDefault();
  var target = $(e.target);

  if(target.hasClass('listen-note')) {
    var content = target.closest('.note').find('.content').text();
    readOutLoud(content);
    if(content=="launch docker")
    {
    	window.location.href='http://192.168.43.206/docker.html';
    }
    else if(content=="run date")
    {
      window.location.href='http://192.168.43.206/cgi-bin/date.py';
    }
    else if(content=="run calendar")
    {
      window.location.href='http://192.168.43.206/cgi-bin/cal.py';
    }
    else if(content=="add user")
    {
      window.location.href='http://192.168.43.206/user.html';
    }
    else if(content=="add group")
    {
      window.location.href='http://192.168.43.206/groupadd.html';
    }
    else if(content=="choose a service")
    {
      window.location.href='http://192.168.43.206/service.html';
    }
    else if(content=="stop service")
    {
      window.location.href='http://192.168.43.206/stopservice.html';
    }
    else if(content=="setup hadoop")
    {
      window.location.href='http://192.168.43.206/cgi-bin/hadoop_automate.html';
    }
    else if(content=="launch ec2")
    {
      window.location.href='http://192.168.43.206/cgi-bin/ec2.py';
    }
    else if(content=="make folder")
    {
      window.location.href='http://192.168.43.206/mkdir.html';
    }
    else if(content=="set ip")
    {
      window.location.href='http://192.168.43.206/ip.html';
    }
    else if(content=="install basic software")
    {
      window.location.href='http://192.168.43.206/install_soft.html';
    }
    else if(content=="show my ip")
    {
      window.location.href='http://192.168.43.206/cgi-bin/checkIP.py';
    }
  }

  if(target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();  
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});


function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;  
	window.speechSynthesis.speak(speech);
}


function renderNotes(notes) {
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}


function saveNote(dateTime, content) {
  localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if(key.substring(0,5) == 'note-') {
      notes.push({
        date: key.replace('note-',''),
        content: localStorage.getItem(localStorage.key(i))
      });
    } 
  }
  return notes;
}


function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime); 
}