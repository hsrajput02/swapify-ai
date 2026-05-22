// Particle leaves
(function generateLeaves() {
    const container = document.querySelector('.particles');
    const count = 10;
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div'); el.className = 'leaf';
        el.style.left = (Math.random() * 100) + '%';
        el.style.top = (Math.random() * -40) + 'vh';
        el.style.opacity = 0.5 + Math.random() * 0.6;
        el.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        el.style.animationDuration = (8 + Math.random() * 14) + 's';
        el.style.width = 20 + Math.floor(Math.random() * 28) + 'px';
        el.style.height = parseInt(el.style.width) * 0.6 + 'px'; container.appendChild(el);
    }
})();

// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');

    // Load saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark-mode');
        toggle.checked = true;
    }

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });
});

const STATE_KEY = 'swapify_pro_v2';
const defaultState = {
    listings: [],
    user: null,
    points: 0,
    activity: [],
    xp: 420,
    pickupRequests: [],
    completedExchanges: []
};
let state = loadState();

function loadState() {
    try {
        const s = JSON.parse(localStorage.getItem(STATE_KEY));
        return { ...defaultState, ...s };
    } catch (e) {
        return { ...defaultState };
    }
}
function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    renderDashboard();
    renderMarketplace();
    updateFloating();
}

if (state.listings.length === 0) {
    state.listings = [
        { id: 1, title: 'Used Mobile Phones (E-waste)', category: 'E-Waste', price: '₹400 - ₹900', location: 'Greater Noida', seller: 'Ravi' },
        { id: 2, title: 'Mixed PET Bottles', category: 'Plastic', price: '₹18/kg', location: 'Noida', seller: 'GreenCollect' },
        { id: 3, title: 'Old Clothes (Donate)', category: 'Textile', price: 'Donate', location: 'Ghaziabad', seller: 'HelpNGO' }
    ];
    saveState();
}

// Navigation helpers
function navClick(section, el) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    navigate(section);
}
const navHistory = [];

function navigate(section) {
    // Save current visible section in history if different
    const current = document.querySelector('main > section:not([style*="display: none"])');
    if (current && current.id !== section) {
        navHistory.push(current.id);
    }

    // Hide all sections
    document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');

    // Show requested section
    const el = document.getElementById(section);
    if (!el) return;

    el.style.display = section === 'home' ? 'grid' : 'block';

    // Render/update content accordingly
    if (section === 'home') renderMarketplace('homeListGrid');
    if (section === 'market') renderMarketplace('marketListGrid');
    if (section === 'dashboard') renderDashboard();
    if (section === 'collectors') initCollectorsMap();

    // Update bottom nav active class
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = [...document.querySelectorAll('.nav-item')].find(n => n.onclick && n.onclick.toString().includes(`navigate('${section}')`) || n.innerText.toLowerCase() === section);
    if (navItem) navItem.classList.add('active');

    // Show or hide back button
    document.getElementById('backBtn').style.display = (navHistory.length > 0 && section !== 'home') ? 'flex' : 'none';


    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigate = navigate;

function goBack() {
    if (navHistory.length === 0) return;
    const prev = navHistory.pop();
    document.getElementById('backBtn').style.display = navHistory.length > 0 ? 'flex' : 'none';
    navigate(prev);
}
window.goBack = goBack;


// login
function simulateLogin() {
    if (state.user) {
        state.user = null;
        document.getElementById('loginBtn').innerText = 'Sign In';
        state.activity.unshift('Signed out');
        saveState();
        return;
    }
    state.user = { name: 'Demo User', email: 'demo@swapify.ai' };
    document.getElementById('loginBtn').innerText = 'Sign Out';
    state.activity.unshift('Signed in');
    saveState();
}
window.simulateLogin = simulateLogin;

// Image upload & preview
let lastSelectedFile = null;
window.onImageSelected = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    lastSelectedFile = file;
    const preview = document.getElementById('previewImg');
    const reader = new FileReader();
    reader.onload = function (ev) {
        preview.style.backgroundImage = `url('${ev.target.result}')`;
        preview.innerText = '';
    };
    reader.readAsDataURL(file);
    document.getElementById('fakeFilename').value = file.name;
    simulateClassification(file.name);
};



function loadSample(name) {

    const preview = document.getElementById('previewImg');
    // preview.style.backgroundImage = 'none';
    // preview.innerText = name;
    preview.style.backgroundImage = `url('${name}')`;
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
    preview.innerText = '';
    document.getElementById('fakeFilename').value = name;
    simulateClassification(name);
}
window.loadSample = loadSample;

// Simulated classification (filename-based)
function simulateClassification(filename) {
    const f = (filename || '').toLowerCase();
    let category = 'Mixed Waste', recyclable = 'Maybe', estimate = 'N/A';
    let bin = 'General Waste';
    let recyclingPoint = 'Community Recycling Center';
    let disposalMethod = 'Dispose as per local regulations';
    let impactReduction = 'Minimal';

    if (f.match(/plastic|bottle|pet/)) {
        category = 'Plastic';
        recyclable = 'Yes';
        estimate = '₹10 - ₹30 per kg';
        bin = 'Dry Waste';
        recyclingPoint = 'GreenCollect - Bulk Plastic Facility';
        disposalMethod = 'Recycle after rinsing';
        impactReduction = 'Reduces landfill waste and pollution';
    }
    else if (f.match(/paper|cardboard|box/)) {
        category = 'Paper';
        recyclable = 'Yes';
        estimate = '₹5 - ₹12 per kg';
        bin = 'Dry Waste';
        recyclingPoint = 'GreenCollect - Paper Recycling Unit';
        disposalMethod = 'Recycle after flattening';
        impactReduction = 'Saves trees and energy';
    }
    else if (f.match(/organic|food|vegetable|fruit|leftover|banana|apple|peels|kitchen|compost/)) {
        category = 'Organic Waste';
        recyclable = 'Partially (Compostable)';
        estimate = 'N/A';
        bin = 'Wet Waste';
        recyclingPoint = 'Local Composting Center / Municipal Biogas Plant';
        disposalMethod = 'Compost at home or drop at wet waste collection point';
        impactReduction = 'Reduces methane emissions and produces nutrient-rich compost';
    }
    else if (f.match(/phone|mobile|battery|electronics|circuit/)) {
        category = 'E-Waste';
        recyclable = 'Yes (Hazardous)';
        estimate = '₹300 - ₹1200';
        bin = 'E-Waste Bin';
        recyclingPoint = 'Authorized E-Waste Collection Center';
        disposalMethod = 'Send to certified e-waste recyclers';
        impactReduction = 'Prevents toxic substance pollution';
    }
    else if (f.match(/metal|can|steel|iron/)) {
        category = 'Metal';
        recyclable = 'Yes';
        estimate = '₹30 - ₹60 per kg';
        bin = 'Dry Waste';
        recyclingPoint = 'GreenCollect - Metal Scrap Yard';
        disposalMethod = 'Recycle metals separately';
        impactReduction = 'Saves mining resources and energy';
    }
    else if (f.match(/cloth|shirt|tshirt|jeans|dress/)) {
        category = 'Textile';
        recyclable = 'Reusable/Donate';
        estimate = 'Donate / ₹20 per kg';
        bin = 'Wet Waste or Donation Bin';
        recyclingPoint = 'Local Textile Recycling Center or Charity';
        disposalMethod = 'Donate or process for reuse/recycling';
        impactReduction = 'Reduces landfill and promotes reuse';
    }

    document.getElementById('predCategory').innerText = category;
    document.getElementById('predRecycle').innerText = recyclable;
    document.getElementById('predValue').innerText = estimate;

    // Add or update bin recommendation details container
    const extraInfoId = 'binRecommendationDetails';
    let extraInfoEl = document.getElementById(extraInfoId);
    if (!extraInfoEl) {
        extraInfoEl = document.createElement('div');
        extraInfoEl.id = extraInfoId;
        extraInfoEl.style.marginTop = '12px';
        extraInfoEl.style.fontSize = '14px';
        extraInfoEl.style.borderTop = '1px solid #d6ead4';
        extraInfoEl.style.paddingTop = '10px';
        const predictionBox = document.getElementById('predictionBox');

        // Insert below the estimate div and before buttons
        const infoContainer = predictionBox.querySelector('div'); // first direct div (with Category/Recyclable/Estimate)
        infoContainer.parentNode.insertBefore(extraInfoEl, infoContainer.nextSibling);
    }

    extraInfoEl.innerHTML = `
    <div><strong>Recommended Bin:</strong> ${bin}</div>
    <div><strong>Nearest Recycling Point:</strong> ${recyclingPoint}</div>
    <div><strong>Best Disposal Method:</strong> ${disposalMethod}</div>
    <div><strong>Environmental Impact:</strong> ${impactReduction}</div>
`;


    state.activity.unshift('Classified item: ' + category + ' (' + filename + ')');
    grantPoints(5);
    saveState();
    showToast('Analysis complete: ' + category);
}

window.triggerClassification = function (fakeName = null) {
    const fn = fakeName || document.getElementById("fakeFilename").value.toLowerCase();
    if (!fn && !lastSelectedFile) return alert('Choose an image or type a filename');
    simulateClassification(fn || lastSelectedFile.name);
}

// Request pickup
function requestPickup() {
    navigate('collectors');
    showToast('Browse collectors and request pickup');
}
window.requestPickup = requestPickup;

// Update floating eco points
function updateFloating() {
    document.getElementById('ecoValue').innerText = state.points || 0;
}
updateFloating();

// Create listing
function createListing(e) {
    e.preventDefault();
    const imageInput = document.getElementById('listingImageInput');
    let imageDataUrl = '';

    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            imageDataUrl = event.target.result;
            finishCreateListing();
        };
        reader.readAsDataURL(file);
    } else {
        finishCreateListing();
    }

    function finishCreateListing() {
        const id = Date.now();
        const title = document.getElementById('title').value || 'Untitled Item';
        const category = document.getElementById('category').value;
        const action = document.getElementById('action').value || 'Sell'; // Get selected action
        const price = document.getElementById('price').value || 'Contact';
        const location = document.getElementById('location').value || 'Unknown';
        const desc = document.getElementById('desc').value || '';

        state.listings.unshift({
            id,
            title,
            category,
            action, // Save action here
            price,
            location,
            desc,
            seller: state.user ? state.user.name : 'Guest',
            image: imageDataUrl
        });

        state.activity.unshift('Created listing: ' + title);
        grantPoints(10);
        saveState();
        showToast('Listing published');
        renderMarketplace('homeListGrid');
        renderMarketplace('marketListGrid');
        navigate('market');
    }
}

window.createListing = createListing;

// Marketplace render
function renderMarketplace(targetId = 'homeListGrid') {
    const grid = document.getElementById(targetId);
    if (!grid) return;

    grid.innerHTML = '';

    let filterCategory = '';
    let filterAction = '';
    if (targetId === 'marketListGrid') {
        filterCategory = document.getElementById('filterCategoryMarket')?.value || '';
        filterAction = document.getElementById('filterActionMarket')?.value || '';
    } else {
        filterCategory = document.getElementById('filterCategory')?.value || '';
        filterAction = ''; // no action filter on home grid
    }

    const maxItems = (targetId === 'homeListGrid') ? 4 : Infinity;

    const listings = state.listings.filter(l => {
        const catMatch = !filterCategory || l.category === filterCategory;
        const actionMatch = !filterAction || l.action === filterAction;
        return catMatch && actionMatch;
    }).slice(0, maxItems);

    if (listings.length === 0) {
        grid.innerHTML = '<div class="muted">No listings yet.</div>';
        return;
    }

    const defaultImage = 'https://placehold.co/320x760?text=No+Image&font=roboto';

    listings.forEach(item => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
        <div class="img" style="background-image: url('${item.image || defaultImage}')">
        </div>
        <h4>${escapeHtml(item.title)}</h4>
        <div class="meta">${escapeHtml(item.category)} • ${escapeHtml(item.location)} • ${escapeHtml(item.action || 'Sell')}</div>
        <div class="price">${escapeHtml(item.price)}</div>
        <div style="margin-top:10px">
            <button class='btn' onclick='connectSeller(${item.id})'>Connect</button>
            <button class='btn ghost' onclick='reportListing(${item.id})'>Report</button>
        </div>
    `;
        grid.appendChild(div);
    });

}


// Connect to seller modal + record activity + points

function connectSeller(id) {
    const item = state.listings.find(l => l.id === id);
    if (!item) return alert('Not found');
    state.activity.unshift('Viewed contact for: ' + item.title);
    saveState();

    // Show modal with contact info + Contact User button (to proceed)
    showModal(`<h3>Contact ${escapeHtml(item.seller)}</h3>
        <p>Price: ${escapeHtml(item.price)}</p>
        <p>Location: ${escapeHtml(item.location)}</p>
        <p>Contact info: demo@example.com</p>
        <div style="margin-top:12px">
          <button class='btn' onclick='showContactExchange(${id})'>Contact User</button> 
          <button class='btn ghost' onclick='closeModal()'>Close</button>
        </div>`);
}
window.connectSeller = connectSeller;

// Called after "Contact User" clicked to show "Confirm" button
function showContactExchange(id) {
    const item = state.listings.find(l => l.id === id);
    if (!item) return closeModal();

    showModal(`<h3>Confirm Exchange</h3>
        <p>Have you contacted ${escapeHtml(item.seller)} and wish to confirm the exchange?</p>
        <div style="margin-top:12px">
          <button class='btn' onclick='confirmExchange(${id})'>Confirm</button> 
          <button class='btn ghost' onclick='closeModal()'>Cancel</button>
        </div>`);
}
window.showContactExchange = showContactExchange;


// Confirm exchange, remove listing, add to completedExchanges
function confirmExchange(id) {
    const it = state.listings.find(l => l.id === id);
    if (!it) return;
    state.activity.unshift('Completed: ' + it.title);
    // Add to completedExchanges with timestamp
    state.completedExchanges.unshift({
        id: it.id,
        title: it.title,
        category: it.category,
        price: it.price,
        location: it.location,
        seller: it.seller,
        completedAt: new Date().toISOString()
    });
    state.listings = state.listings.filter(l => l.id !== id);
    grantPoints(20);
    saveState();
    closeModal();
    showToast('Exchange completed');
    // navigate('dashboard');
}
window.confirmExchange = confirmExchange;

// Report listing
function reportListing(id) {
    state.activity.unshift('Reported ' + id);
    saveState();
    showToast('Reported — thank you');
}

function requestPickupForListing(id) {
    const listing = state.listings.find(l => l.id === id);
    if (!listing) return showToast('Listing not found');
    // avoid duplicate pickup requests for same listing
    if (state.pickupRequests.find(r => r.id === id)) return showToast('Pickup already requested for this listing');

    state.pickupRequests.unshift({
        id: listing.id,
        title: listing.title,
        category: listing.category,
        location: listing.location,
        seller: listing.seller,
        requestedAt: new Date().toISOString()
    });
    state.activity.unshift('Pickup requested for: ' + listing.title);
    grantPoints(12);
    saveState();
    showToast('Pickup requested for your listing');
}
window.requestPickupForListing = requestPickupForListing;



// Collectors contact
function contactCollector(name) {
    state.activity.unshift('Pickup requested from ' + name);
    grantPoints(12);
    saveState();
    showToast('Pickup requested — ' + name);
}

// Dashboard rendering including completed exchanges
function renderDashboard() {
    const points = state.points || 0;
    const listingsCount = state.listings.length;
    const co2Saved = (points * 0.6).toFixed(1);

    document.getElementById('dashPoints').innerText = points;
    document.getElementById('dashListings').innerText = listingsCount;
    document.getElementById('dashCO2').innerText = co2Saved;

    // Recent Activity
    const recentEl = document.getElementById('recentActivity');
    recentEl.innerHTML = '';
    state.activity.slice(0, 20).forEach(a => {
        const li = document.createElement('li');
        li.innerText = a;
        recentEl.appendChild(li);
    });

    // Completed Exchanges
    const completedList = document.getElementById('completedExchangesList');
    completedList.innerHTML = '';
    (state.completedExchanges || []).slice(0, 20).forEach(ex => {
        const li = document.createElement('li');
        const d = new Date(ex.completedAt);
        const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        li.textContent = `${ex.title} (${ex.category}) - ${dateStr}`;
        completedList.appendChild(li);
    });

    document.getElementById('homePoints').innerText = points;
    document.getElementById('homeCO2').innerText = co2Saved + ' kg';
    document.getElementById('miniActivity').innerText = state.activity[0] || '—';
    document.getElementById('ecoValue').innerText = points;

    const user = state.user?.name || null;

    // Remove existing myListingsContainer and pickupRequestsContainer if present
    let myListingsContainer = document.getElementById('myListingsContainer');
    if (!myListingsContainer) {
        myListingsContainer = document.createElement('div');
        myListingsContainer.id = 'myListingsContainer';
        myListingsContainer.style.marginTop = '12px';
        document.getElementById('dashboard').appendChild(myListingsContainer);
    }

    myListingsContainer.innerHTML = '<h4>My Listings</h4>';
    const ulListings = document.createElement('ul');
    if (user) {
        const myListings = state.listings.filter(l => l.seller === user);
        if (myListings.length === 0) {
            ulListings.innerHTML = '<li><em>No listings created by you.</em></li>';
        } else {
            myListings.forEach(l => {
                const li = document.createElement('li');
                li.textContent = `${l.title} (${l.category}) - ${l.location}`;
                ulListings.appendChild(li);
            });
        }
    } else {
        ulListings.innerHTML = '<li><em>Please sign in to see your listings.</em></li>';
    }
    myListingsContainer.appendChild(ulListings);

    let myRequestsContainer = document.getElementById('myPickupRequestsContainer');
    if (!myRequestsContainer) {
        myRequestsContainer = document.createElement('div');
        myRequestsContainer.id = 'myPickupRequestsContainer';
        myRequestsContainer.style.marginTop = '12px';
        document.getElementById('dashboard').appendChild(myRequestsContainer);
    }

    myRequestsContainer.innerHTML = '<h4>My Pickup Requests</h4>';
    const ulRequests = document.createElement('ul');
    if (user) {
        const myRequests = state.pickupRequests.filter(r => r.seller === user);
        if (myRequests.length === 0) {
            ulRequests.innerHTML = '<li><em>No pickup requests made yet.</em></li>';
        } else {
            myRequests.forEach(r => {
                const li = document.createElement('li');
                const d = new Date(r.requestedAt);
                li.textContent = `${r.title} (${r.category}) - Requested on ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                ulRequests.appendChild(li);
            });
        }
    } else {
        ulRequests.innerHTML = '<li><em>Please sign in to see your pickup requests.</em></li>';
    }
    myRequestsContainer.appendChild(ulRequests);

    // Progress bar & rank
    const maxPoints = 1000; // points for max progress bar
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const rankBadge = document.getElementById('rankBadge');

    let progressPercent = Math.min(points / maxPoints * 100, 100);
    progressBar.style.width = progressPercent + '%';
    progressText.textContent = `${points} / ${maxPoints} points`;

    // Determine rank & style
    let rank = 'Bronze';
    let rankClass = 'rank-bronze';
    if (points >= 750) {
        rank = 'Platinum';
        rankClass = 'rank-platinum';
    } else if (points >= 500) {
        rank = 'Gold';
        rankClass = 'rank-gold';
    } else if (points >= 250) {
        rank = 'Silver';
        rankClass = 'rank-silver';
    }

    rankBadge.textContent = rank;
    rankBadge.className = '';
    rankBadge.classList.add(rankClass);
}

// Points & XP
function grantPoints(n) {
    state.points = (state.points || 0) + n;
    state.xp = (state.xp || 0) + Math.floor(n * 2);
    state.activity.unshift('Earned ' + n + ' points');
}

// Modal & toast
function showModal(html) {
    const root = document.getElementById('modalRoot');
    root.style.display = 'block';

    // Wrap content in a div with modal and active classes for styling & visibility
    root.innerHTML = `<div class='modal active'><div class='modal-content card'>${html}</div></div>`;

    // Wire modal close buttons again
    document.querySelectorAll('.close-modal').forEach(btn =>
        btn.addEventListener('click', closeModal)
    );
}

function closeModal() {
    const root = document.getElementById('modalRoot');
    root.style.display = 'none';
    root.innerHTML = '';
}

function showToast(msg) {
    showModal(`<div style='text-align:center'><strong>${escapeHtml(msg)}</strong><div style='margin-top:10px'><button class='btn' onclick='closeModal()'>OK</button></div></div>`);
    setTimeout(closeModal, 1800);
}

// Floating update
function updateFloating() {
    document.getElementById('ecoValue').innerText = state.points || 0;
}

// utilities
function escapeHtml(s) {
    if (!s) return '';
    return (s + '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// Redeem & donate points functionality
function redeemPoints() {
    if (!state.user) return showToast('Please sign in to redeem points');
    if (state.points < 1000) return showToast('You need at least 1000 points to redeem');
    state.points -= 1000;
    state.activity.unshift('Redeemed 1000 points');
    saveState();
    showToast('Redeemed 1000 Eco Points. Thank you!');
}
function donatePoints() {
    if (!state.user) return showToast('Please sign in to donate points');
    const donateAmount = 500;
    if (state.points < donateAmount) return showToast(`You need at least ${donateAmount} points to donate`);
    state.points -= donateAmount;
    state.activity.unshift(`Donated ${donateAmount} points to charity`);
    saveState();
    showToast(`Thank you for donating ${donateAmount} Eco Points!`);
}
window.redeemPoints = redeemPoints;
window.donatePoints = donatePoints;

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').innerText = state.user ? 'Sign Out' : 'Sign In';
    renderMarketplace();
    renderDashboard();
    updateFloating();
    navigate('home');
    saveState();
    const btnRequestPickup = document.getElementById('btnRequestPickup');
    if (btnRequestPickup) {
        btnRequestPickup.addEventListener('click', () => {
            // Validate minimum input (title)
            const title = document.getElementById('title').value;
            if (!title) return alert('Please enter a title first.');

            // Read image if any, then create listing and request pickup
            const imageInput = document.getElementById('listingImageInput');
            let imageDataUrl = '';

            function createListingAndRequestPickup() {
                const category = document.getElementById('category').value;
                const price = document.getElementById('price').value || 'Contact';
                const location = document.getElementById('location').value || 'Unknown';
                const desc = document.getElementById('desc').value || '';
                const id = Date.now();
                const sellerName = state.user ? state.user.name : 'Guest';

                state.listings.unshift({
                    id,
                    title,
                    category,
                    price,
                    location,
                    desc,
                    seller: sellerName,
                    image: imageDataUrl
                });
                state.activity.unshift('Created listing: ' + title);
                grantPoints(10);
                saveState();
                showToast('Listing published');

                // request pickup for this listing
                requestPickupForListing(id);

                // navigate dashboard to see requests
                navigate('dashboard');
            }

            if (imageInput.files && imageInput.files[0]) {
                const file = imageInput.files[0];
                const reader = new FileReader();
                reader.onload = function (e) {
                    imageDataUrl = e.target.result;
                    createListingAndRequestPickup();
                };
                reader.readAsDataURL(file);
            } else {
                createListingAndRequestPickup();
            }
        });
    }
});

// ==== Unified upload / camera / modal / toast logic ====

const resultModal = document.getElementById('resultModal');
const toastEl = document.getElementById('toast');
const scannerEl = document.querySelector('.scanner');
const fileInputEl = document.getElementById('fileInput');
const previewWrap = document.getElementById('previewWrap');
const previewImg = document.getElementById('previewImg');
const captureBtn = document.getElementById('captureBtn');
const cameraVideo = document.getElementById('cameraStream');
let cameraStream = null;

// Toast (small bottom popup)
function showSmallToast(text, ms = 1800) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), ms);
}

// File upload handler & preview
fileInputEl.addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    previewImg.style.backgroundImage = `url('${url}')`;
    previewImg.style.backgroundSize = 'cover';
    previewImg.style.backgroundPosition = 'center';
    previewImg.innerText = '';

    // show scanning modal / simulate classification
    showResultModal('Scanning...', 'Swapify AI is analyzing the image...');
    scannerEl.classList.add('scan-success');

    setTimeout(() => {
        const cat = simulateAIResultFromName(file.name || file.type || 'upload');
        showResultModal('Category Detected', `Item classified as: <strong>${cat}</strong>`);
        grantPoints(5);
        saveState();
        showSmallToast('🎉 +5 Eco Points Earned!');
        setTimeout(hideResultModal, 1500);

        if (window.simulateClassification) window.simulateClassification(file.name || 'uploaded_image');
    }, 1200);
});

// Camera controls
async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        cameraVideo.srcObject = cameraStream;
        cameraVideo.style.display = 'block';
        captureBtn.style.display = 'inline-block';

        // Hide all control buttons except capture
        const controlsRow = document.querySelector('.controls-row');
        if (controlsRow) {
            [...controlsRow.children].forEach(child => {
                if (child !== captureBtn) {
                    child.style.display = 'none';
                }
            });
        }

        // hide the scanner's inline preview text
        previewImg.style.backgroundImage = 'none';
        previewWrap.style.display = 'none'; // Hide preview container to prevent overlap

        classifyVideoFrames();
    } catch (err) {
        alert('Camera access denied or unavailable');
        console.error(err);
    }
}
window.startCamera = startCamera;

function stopCamera() {
    if (!cameraStream) return;
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
    cameraVideo.style.display = 'none';
    captureBtn.style.display = 'none';
    previewWrap.style.display = 'flex'; // Show preview container again

    // Show all control buttons again
    const controlsRow = document.querySelector('.controls-row');
    if (controlsRow) {
        [...controlsRow.children].forEach(child => {
            child.style.display = '';
        });
    }
}
window.stopCamera = stopCamera;

function capturePhoto() {
    if (!cameraStream) return alert('Camera not started');
    const canvas = document.getElementById('captureCanvas');
    canvas.width = cameraVideo.videoWidth || 640;
    canvas.height = cameraVideo.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
    stopCamera();

    const dataUrl = canvas.toDataURL('image/png');
    previewImg.style.backgroundImage = `url(${dataUrl})`;
    previewImg.style.backgroundSize = 'cover';
    previewImg.style.backgroundPosition = 'center';
    previewImg.innerHTML = '';

    // simulated classification flow
    showResultModal('Scanning...', 'Swapify AI is analyzing your capture...');
    setTimeout(() => {
        const cat = simulateAIResultFromName('camera_capture.png');
        showResultModal('Category Detected', `Item classified as: <strong>${cat}</strong>`);
        grantPoints(5);
        saveState();
        showSmallToast('🎉 +5 Eco Points Earned!');
        setTimeout(hideResultModal, 1500);
        if (window.triggerClassification) window.triggerClassification('camera_capture.png');
    }, 900);
}
window.capturePhoto = capturePhoto;

// Modal close buttons
document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', hideResultModal));
function showResultModal(title, message) {
    resultModal.querySelector('h3').innerHTML = title;
    resultModal.querySelector('p').innerHTML = message;
    resultModal.classList.add('active');
}
function hideResultModal() {
    resultModal.classList.remove('active');
}

// Simulated classification helper (filename-based)
function simulateAIResultFromName(name = '') {
    const f = (name + '').toLowerCase();
    if (f.match(/plastic|bottle|pet/)) return 'Plastic Bottle';
    if (f.match(/metal|can|steel|iron/)) return 'Metal Can';
    if (f.match(/phone|battery|electronics|circuit/)) return 'E-Waste';
    if (f.match(/organic|food|veg|vegetable|fruit|leftover|kitchen|scrap|banana|apple|peel|garden|compost|bio/)) return 'Organic Waste';
    if (f.match(/glass/)) return 'Glass';
    if (f.match(/cloth|shirt|tshirt|jeans|dress/)) return 'Clothing';
    if (f.match(/paper|cardboard|box/)) return 'Paper';
    const categories = ['Plastic Bottle', 'Metal Can', 'E-Waste', 'Glass', 'Clothing', 'Paper'];
    return categories[Math.floor(Math.random() * categories.length)];
}

// Chat popup logic
const chatPopup = document.getElementById('chatPopup');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

function toggleChat(show) {
    chatPopup.style.display = show ? 'flex' : 'none';
    if (show) {
        chatInput.focus();
        if (chatMessages.children.length === 0) {
            addChatMessage('system', 'Hello! I’m Swapify AI. How can I help you today?');
        }
    }
}
document.querySelector('.eco-floating-chat').addEventListener('click', () => {
    toggleChat(true);
});

function addChatMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;
    addChatMessage('user', msg);
    chatInput.value = '';
    // Simulate system reply after delay
    setTimeout(() => {
        addChatMessage('system', 'Thanks for your message: "' + msg + '". This is a demo chat.');
    }, 800);
});

// === Tensorflow.js MobileNet integration for live video classification ===
let net = null;
const video = cameraVideo;

async function loadMobilenet() {
    net = await mobilenet.load();
    console.log('MobileNet model loaded');
}
loadMobilenet();

async function classifyVideoFrames() {
    if (!net || video.readyState !== 4) {
        requestAnimationFrame(classifyVideoFrames);
        return;
    }
    try {
        const predictions = await net.classify(video);
        if (predictions && predictions.length > 0) {
            const top = predictions[0];
            document.getElementById('predCategory').innerText = top.className;
            document.getElementById('predRecycle').innerText = 'N/A';
            document.getElementById('predValue').innerText = (top.probability * 100).toFixed(2) + '%';
        }
    } catch (e) {
        // ignore errors while classifying
        // console.error('Error classifying video:', e);
    }
    requestAnimationFrame(classifyVideoFrames);
}

// ========== Leaflet map integration for collectors ==========

function initCollectorsMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    const defaultLatLng = [28.5818, 77.3570]; // Greater Noida
    const zoomLevel = 13;

    // Initialize map if not already
    if (!window._map) {
        window._map = L.map('map').setView(defaultLatLng, zoomLevel);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(window._map);
    }

    const map = window._map;

    // Clear existing markers layers except tile layer
    if (window._collectorMarkers) {
        window._collectorMarkers.forEach(m => map.removeLayer(m));
    }
    window._collectorMarkers = [];

    // Collectors data with lat/lng
    const collectors = [
        { name: 'GreenCollect', latlng: [28.5845, 77.3670], desc: 'Pickup service • Rating 4.6' },
        { name: 'Ravi Kabadiwala', latlng: [28.5770, 77.3500], desc: 'Local collector • Rating 4.2' },
        { name: 'Scrap Dealer', latlng: [28.5900, 77.3600], desc: 'Home visit service • Rating 4.8' },
    ];

    function addCollectorMarker(c) {
        const marker = L.marker(c.latlng).addTo(map);
        marker.bindPopup(`<b>${c.name}</b><br>${c.desc}<br><button class="btn-map" onclick="contactCollector('${c.name}')">Request Pickup</button>`);
        window._collectorMarkers.push(marker);
    }

    // Add all collectors markers
    collectors.forEach(addCollectorMarker);

    // Try to get user's current location and center map
    map.locate({ setView: true, maxZoom: zoomLevel, watch: false, enableHighAccuracy: true });

    function onLocationFound(e) {
        const radius = e.accuracy;

        if (window._userMarker) {
            map.removeLayer(window._userMarker);
            map.removeLayer(window._accuracyCircle);
        }

        window._userMarker = L.marker(e.latlng, {
            title: "Your Location", icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            })
        }).addTo(map).bindPopup("You are here").openPopup();

        window._accuracyCircle = L.circle(e.latlng, radius).addTo(map);

        // Optional: filter only nearby collectors within radius (e.g. 5km)
        // For demo, just keep all.
    }

    function onLocationError(e) {
        // Location not available or denied, keep default view
        console.log("Geolocation error: " + e.message);
        map.setView(defaultLatLng, zoomLevel);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}



window.contactCollector = contactCollector;

// Utilities to escape HTML to prevent injection
function escapeHtml(s) {
    if (!s) return '';
    return (s + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}