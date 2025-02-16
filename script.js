document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
      navUl.style.display = navUl.style.display === 'flex' ? 'none' : 'flex';
    });
  });
  