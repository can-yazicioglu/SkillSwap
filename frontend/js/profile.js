document.addEventListener('DOMContentLoaded', function() {
  const addTeachBtn = document.getElementById('add-teach-btn');
  const teachInput = document.getElementById('teach-skill-input');
  const teachContainer = document.getElementById('teach-skills-container');
  
  if (addTeachBtn) {
    addTeachBtn.addEventListener('click', function() {
      const skill = teachInput.value.trim();
      if (skill) {
        const tag = createSkillTag(skill, 'teach');
        teachContainer.appendChild(tag);
        teachInput.value = '';
      }
    });
  }
  
  const addLearnBtn = document.getElementById('add-learn-btn');
  const learnInput = document.getElementById('learn-skill-input');
  const learnContainer = document.getElementById('learn-skills-container');
  
  if (addLearnBtn) {
    addLearnBtn.addEventListener('click', function() {
      const skill = learnInput.value.trim();
      if (skill) {
        const tag = createSkillTag(skill, 'learn');
        learnContainer.appendChild(tag);
        learnInput.value = '';
      }
    });
  }
  

  const saveBtn = document.querySelector('button[type="submit"]');
  if (saveBtn) {
    saveBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showAlert('Profile saved!', 'success');
      setTimeout(function() {
        window.location.href = 'swipe.html';
      }, 1500);
    });
  }
  
  const editBtn = document.getElementById('edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', function() {
      window.location.href = 'profile-setup.html';
    });
  }
});