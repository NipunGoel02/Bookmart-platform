var typed = new Typed(".multiple-text", {
    strings:[" BOOKS BUYING","BOOKS SELLING","BOOK EXCHANGE"],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
}) 
const popupTriggers = [
    "open-popup",
    "open-popups",
    "open-popupss",
    "open-popupsss",
    "open-popupssss",
    "open-popupsssss",
    "open-popupssssss",
    "open-popupsssssss"
];

// Loop through each trigger and add the appropriate click event
popupTriggers.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.onclick = function() {
            if (isLoggedIn) {
                // Redirect to the login page if the user is logged in
                window.location.href = "/login";
            } else {
                // Show the popup if the user is not logged in
                document.getElementById("popup").style.display = "block";
            }
        };
    }
});

document.getElementById("close-popup").onclick = function() {
    document.getElementById("popup").style.display = "none";
};

// Close the popup if the user clicks anywhere outside of the popup content
window.onclick = function(event) {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        popup.style.display = "none";
    }
};

   // Get the elements
   const servicesLink = document.getElementById('services-link');
   const dropdownContent = document.getElementById('services-dropdown');
   onclick((servicesLink)=>console.log("clicked"
   ) )

   // Hide the dropdown initially
   dropdownContent.style.display = 'none';

   // Toggle the dropdown when the "Services" link is clicked
   servicesLink.addEventListener('click', function(event) {
       event.preventDefault(); // Prevent default anchor behavior
       if (dropdownContent.style.display === 'none') {
           dropdownContent.style.display = 'block';
       } else {
           dropdownContent.style.display = 'none';
       }
   });

   // Optional: Hide the dropdown when clicking outside
   document.addEventListener('click', function(event) {
       if (!servicesLink.contains(event.target) && !dropdownContent.contains(event.target)) {
           dropdownContent.style.display = 'none';
       }
   });