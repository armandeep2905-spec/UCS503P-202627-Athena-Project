# Week 8 — Integration of Campus Navigation 

## **Problem / Challenge**

This week, the development work focused on integrating Athena's 2D campus navigation system with the main frontend and backend. The objective was to make the previously developed map accessible through the application's interface instead of running it as a separate module.

The main challenge was connecting the map interface with the existing application structure while ensuring that its images, scripts, styles, and navigation functionality continued to work correctly.

## **Problems Faced**

### **1. Incorrect Static File Paths**

```
GET /static/campus-map-opt.jpg 404 (Not Found)
```

While integrating the map into the main frontend, some image and resource paths were not correctly configured. As a result, the campus map and other required files failed to load.

### **2. Frontend and Backend API Communication**

```
Failed to fetch
```

The frontend faced communication issues while sending requests to the backend. Incorrect API endpoints and differences between frontend and backend configurations prevented successful communication.

### **3. JavaScript Element Initialization**

```
TypeError: Cannot read properties of null (reading 'addEventListener')
```

Some JavaScript functions were executed before the required map elements were available in the integrated page. This caused event listeners and map interactions to fail.

### **4. CSS and Layout Conflicts**

The map's original styling conflicted with the main application's layout. This affected the map dimensions, positioning, and responsiveness when displayed inside the existing frontend.

## **Solution**

1. **Frontend integration:** Connected the existing campus map interface with Athena's main frontend.
2. **Static file configuration:** Corrected image, CSS, and JavaScript paths to ensure that map resources loaded correctly.
3. **Backend integration:** Configured the required API endpoints and connected frontend requests with the backend.
4. **JavaScript initialization:** Ensured map-related functions and event listeners were initialized after the required page elements were loaded.
5. **Layout adjustments:** Updated CSS and container dimensions to display the map properly within the application's interface.
6. **Integration testing:** Tested map loading, location selection, route calculation, and interactions within the integrated application.

