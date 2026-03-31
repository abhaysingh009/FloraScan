// Navigation functions
      function goToPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll(".page");
        pages.forEach((page) => {
          page.classList.remove("active", "prev");
          page.classList.add("prev");
          page.setAttribute("aria-hidden", "true");
        });

        // Show target page
        setTimeout(() => {
          const targetPage = document.getElementById(pageId);
          if (targetPage) {
            targetPage.classList.remove("prev");
            targetPage.classList.add("active");
            targetPage.removeAttribute("aria-hidden");
            targetPage.focus?.();
            // Scroll top to avoid scroll issues on jumping pages
            targetPage.scrollTop = 0;
          }
        }, 100);
      }

      // Option selection functions for multi-select options
      function toggleOption(element) {
        const isSelected = element.classList.toggle("selected");
        element.setAttribute("aria-checked", isSelected.toString());
      }

      // Keyboard handler for multi-select options (space/enter toggles selection)
      function optionKeyDown(event, element) {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          toggleOption(element);
        }
      }

      // Option selection function for single-select interest options
      function selectSingleOption(element, groupName) {
        const container = element.parentElement;
        if (!container) return;
        const options = container.querySelectorAll(".interest-option");
        options.forEach((option) => {
          option.classList.remove("selected");
          option.setAttribute("aria-checked", "false");
        });
        element.classList.add("selected");
        element.setAttribute("aria-checked", "true");
      }

      // Keyboard handler for single-select interest options (space/enter selects)
      function interestOptionKeyDown(event, element) {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          selectSingleOption(element, "interest-level");
        }
      }

      // Location function
      function requestLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              alert(
                `Location shared! Latitude: ${position.coords.latitude.toFixed(
                  2
                )}, Longitude: ${position.coords.longitude.toFixed(2)}`
              );
              goToPage("landing");
            },
            function () {
              alert(
                "Location access denied or unavailable. You can continue without location services."
              );
            }
          );
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }

      // Prevent default link behavior for all <a href="#">
      document.addEventListener("DOMContentLoaded", function () {
        const links = document.querySelectorAll('a[href="#"]');
        links.forEach((link) => {
          link.addEventListener("click", function (e) {
            e.preventDefault();
          });
        });
      });