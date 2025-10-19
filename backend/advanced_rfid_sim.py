# rfid_simulation_final_with_scroll_fix.py

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import math
from collections import Counter
import json
import time
from datetime import datetime

# --- Prerequisite: pip install matplotlib ---
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# --- (1) Core Simulation Data ---
PRODUCT_DATABASE = {
    'Bluetooth Headphones': 'RFID_BH_9X01',
    'USB-C Cable': 'RFID_USBC_2A8X',
    'Phone Case': 'RFID_PC_4Y3Z',
    'Charging Dock': 'RFID_CD_A7V1',
    'Screen Protector': 'RFID_SP_E2W3',
    'Wireless Charger': 'RFID_WC_G5T6',
    'Power Bank': 'RFID_PB_H9J2',
    'Bonus Item (Keychain)': 'RFID_BI_F8C9'
}

# --- Item Class ---
class Item:
    def __init__(self, name, rfid_tag, x, y, size=20):
        self.name = name
        self.rfid_tag = rfid_tag
        self.x = x
        self.y = y
        self.size = size
        self.canvas_id = None
        self.text_id = None
        self.rfid_text_id = None
        self.detected = False

# --- Main Application Class ---
class RFIDSimulationApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("RFID Package Verification System (Final Version)")
        self.geometry("1550x800")
        self.resizable(False, False)
        self.configure(bg="#2c3e50")

        # --- State Management Variables ---
        self.customer_order_list = []
        self.placed_items = []
        self.detected_rfids = set()
        self.expected_rfids_set = set()
        self.item_instance_counter = Counter()
        self.scan_mode_active = False
        self.scanner_id = None
        self.drag_data = {"x": 0, "y": 0, "item": None}
        self.order_confirmed = False
        self.scan_start_time = None
        self.last_verification_data = {}

        self.create_widgets()

    def create_widgets(self):
        style = ttk.Style(self)
        style.theme_use('clam')
        style.configure('TFrame', background='#34495e')
        style.configure('Vertical.TScrollbar', background='#2c3e50', troughcolor='#34495e')
        style.configure('TLabel', background='#34495e', foreground='white', font=('Segoe UI', 10))
        style.configure('TButton', background='#2ecc71', foreground='white', font=('Segoe UI', 10, 'bold'))
        style.map('TButton', background=[('active', '#27ae60')])
        style.configure('Finalize.TButton', background='#3498db', foreground='white')
        style.map('Finalize.TButton', background=[('active', '#2980b9')])
        style.configure('TCombobox', fieldbackground='#ecf0f1', background='#bdc3c7', foreground='#2c3e50')
        style.configure('TSpinbox', fieldbackground='#ecf0f1', foreground='#2c3e50')
        style.configure('TEntry', fieldbackground='#ecf0f1', foreground='#2c3e50')
        style.configure('Info.TLabel', background='#2980b9', foreground='white', font=('Segoe UI', 10, 'italic'))
        style.configure('Success.TLabel', background='#27ae60', foreground='white', font=('Segoe UI', 12, 'bold'))
        style.configure('Error.TLabel', background='#e74c3c', foreground='white', font=('Segoe UI', 12, 'bold'))
        style.configure('Warning.TLabel', background='#f39c12', foreground='white', font=('Segoe UI', 12, 'bold'))
        style.configure('Caution.TLabel', background='#f39c12', foreground='black', font=('Segoe UI', 12, 'bold'))

        header_frame = ttk.Frame(self, style='TFrame')
        header_frame.pack(side="top", fill="x", pady=10)
        ttk.Label(header_frame, text="RFID Package Verification System",
                  font=('Segoe UI', 20, 'bold'), foreground='white', background='#2c3e50').pack(pady=5)
        
        content_frame = ttk.Frame(self, style='TFrame')
        content_frame.pack(fill="both", expand=True, padx=10, pady=10)
        content_frame.grid_columnconfigure(0, weight=1)
        content_frame.grid_columnconfigure(1, weight=0)
        content_frame.grid_columnconfigure(2, weight=0)
        content_frame.grid_rowconfigure(0, weight=1)
        
        self.canvas_frame = ttk.Frame(content_frame, style='TFrame', relief="groove", borderwidth=2)
        self.canvas_frame.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")
        self.canvas = tk.Canvas(self.canvas_frame, bg="#34495e", highlightthickness=0)
        self.canvas.pack(fill="both", expand=True, padx=5, pady=5)
        self.canvas.bind("<Button-1>", self.on_canvas_click)
        self.package_x1, self.package_y1, self.package_x2, self.package_y2 = 50, 50, 700, 650
        self.canvas.create_rectangle(self.package_x1, self.package_y1, self.package_x2, self.package_y2,
                                     outline="black", dash=(5, 2), width=3, tags="package_boundary")
        ttk.Label(self.canvas_frame, text="Package Contents (Disabled until order is confirmed)",
                  font=('Segoe UI', 11, 'bold'), background="#34495e", foreground="gray", name="package_contents_label").pack(pady=5)
        
        # --- SCROLLABLE MIDDLE COLUMN SETUP ---
        controls_container = ttk.Frame(content_frame)
        controls_container.grid(row=0, column=1, padx=10, pady=10, sticky="ns")
        controls_canvas = tk.Canvas(controls_container, bg="#34495e", highlightthickness=0)
        scrollbar = ttk.Scrollbar(controls_container, orient="vertical", command=controls_canvas.yview, style='Vertical.TScrollbar')
        scrollable_frame = ttk.Frame(controls_canvas, style='TFrame')
        controls_canvas.configure(yscrollcommand=scrollbar.set)
        controls_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        def on_frame_configure(event):
            controls_canvas.configure(scrollregion=controls_canvas.bbox("all"))
        scrollable_frame.bind("<Configure>", on_frame_configure)
        controls_canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        # --- END SCROLLABLE SETUP ---

        # Add all control panels to the *scrollable_frame*
        self.create_cart_management_panel(scrollable_frame)
        ttk.Label(scrollable_frame, text="Expected Items (Shopping Cart)", font=('Segoe UI', 12, 'bold')).pack(pady=(10, 5))
        self.expected_items_frame = ttk.Frame(scrollable_frame, relief="ridge", borderwidth=1)
        self.expected_items_frame.pack(fill="x", padx=5, pady=5)
        self.create_item_placement_panel(scrollable_frame)
        self.create_scanner_panel(scrollable_frame)
        
        metrics_sidebar = ttk.Frame(content_frame, style='TFrame')
        metrics_sidebar.grid(row=0, column=2, padx=10, pady=10, sticky="nsew")
        self.create_metrics_panel(metrics_sidebar)
        
        self.update_expected_items_status()
        self.update_widget_states()

    def create_cart_management_panel(self, parent):
        ttk.Label(parent, text="Step 1: Create Customer Order", font=('Segoe UI', 12, 'bold')).pack(pady=(10, 5))
        self.cart_frame = ttk.Frame(parent, style='TFrame', relief="ridge", borderwidth=1)
        self.cart_frame.pack(fill="x", padx=5, pady=5)
        ttk.Label(self.cart_frame, text="Product:").grid(row=0, column=0, padx=5, pady=2, sticky="w")
        self.cart_item_var = tk.StringVar()
        self.cart_item_dropdown = ttk.Combobox(self.cart_frame, textvariable=self.cart_item_var, values=list(PRODUCT_DATABASE.keys()), state="readonly")
        self.cart_item_dropdown.grid(row=0, column=1, columnspan=2, padx=5, pady=2, sticky="ew")
        self.cart_item_dropdown.set(list(PRODUCT_DATABASE.keys())[0])
        ttk.Label(self.cart_frame, text="Quantity:").grid(row=1, column=0, padx=5, pady=2, sticky="w")
        self.cart_qty_var = tk.StringVar(value="1")
        ttk.Spinbox(self.cart_frame, from_=1, to=99, textvariable=self.cart_qty_var, width=5).grid(row=1, column=1, padx=5, pady=2, sticky="w")
        ttk.Button(self.cart_frame, text="Add to Cart", command=self.add_to_cart).grid(row=1, column=2, padx=5, pady=5)
        ttk.Button(self.cart_frame, text="Clear Cart", command=self.clear_cart).grid(row=2, column=0, columnspan=2, pady=5)
        ttk.Button(self.cart_frame, text="Confirm Order", command=self.confirm_order).grid(row=2, column=2, pady=5)

    def create_item_placement_panel(self, parent):
        ttk.Label(parent, text="Step 2: Configure Package Items", font=('Segoe UI', 12, 'bold')).pack(pady=(15, 5))
        self.config_frame = ttk.Frame(parent, style='TFrame', relief="ridge", borderwidth=1)
        self.config_frame.pack(fill="x", padx=5, pady=5)
        ttk.Label(self.config_frame, text="Select Item:").pack(pady=2, padx=5, anchor="w")
        self.item_select_var = tk.StringVar()
        self.item_select_dropdown = ttk.Combobox(self.config_frame, textvariable=self.item_select_var, values=list(PRODUCT_DATABASE.keys()), state="readonly")
        self.item_select_dropdown.pack(fill="x", padx=5, pady=2)
        ttk.Button(self.config_frame, text="Add Selected Item (Click Canvas)", command=self.add_item_to_package).pack(pady=5)
        ttk.Button(self.config_frame, text="Clear All Items & Reset Order", command=self.clear_all_items).pack(pady=5)

    def create_scanner_panel(self, parent):
        ttk.Label(parent, text="Step 3: Scan Package", font=('Segoe UI', 12, 'bold')).pack(pady=(15, 5))
        self.scanner_frame = ttk.Frame(parent, style='TFrame', relief="ridge", borderwidth=1)
        self.scanner_frame.pack(fill="x", padx=5, pady=5)
        ttk.Label(self.scanner_frame, text="Scan Range (px):").grid(row=0, column=0, padx=5, pady=2, sticky="w")
        self.scanner_range_var = tk.StringVar(value="80")
        ttk.Entry(self.scanner_frame, textvariable=self.scanner_range_var, width=10).grid(row=0, column=1, padx=5, pady=2, sticky="ew")
        self.initiate_scan_button = ttk.Button(self.scanner_frame, text="Initiate Scan", command=self.initiate_scan)
        self.initiate_scan_button.grid(row=1, column=0, pady=10, padx=5)
        self.finalize_scan_button = ttk.Button(self.scanner_frame, text="Finalize Verification", command=self.finalize_verification, style="Finalize.TButton")
        self.finalize_scan_button.grid(row=1, column=1, pady=10, padx=5)
        
    def create_metrics_panel(self, parent):
        ttk.Label(parent, text="Verification Dashboard", font=('Segoe UI', 14, 'bold')).pack(pady=(10, 5))
        stats_frame = ttk.Frame(parent, relief="ridge", borderwidth=1)
        stats_frame.pack(fill="x", padx=5, pady=10)
        ttk.Label(stats_frame, text="Scan Metrics", font=('Segoe UI', 11, 'bold')).grid(row=0, column=0, columnspan=2, pady=5)

        self.metrics_labels = {}
        metrics_to_show = ["Status", "Scan Duration", "Items Expected", "Items Detected", "Items Missing", "Items Extra"]
        for i, metric in enumerate(metrics_to_show):
            ttk.Label(stats_frame, text=f"{metric}:").grid(row=i+1, column=0, padx=5, pady=2, sticky="w")
            self.metrics_labels[metric] = ttk.Label(stats_frame, text="-")
            self.metrics_labels[metric].grid(row=i+1, column=1, padx=5, pady=2, sticky="w")

        graph_frame = ttk.Frame(parent, relief="ridge", borderwidth=1)
        graph_frame.pack(fill="both", expand=True, padx=5, pady=10)
        
        self.fig = plt.Figure(figsize=(5, 4), dpi=100, facecolor='#34495e')
        self.ax = self.fig.add_subplot(111)
        self.ax.tick_params(axis='x', colors='white')
        self.ax.tick_params(axis='y', colors='white')
        self.ax.spines['bottom'].set_color('white')
        self.ax.spines['top'].set_color('#34495e') 
        self.ax.spines['right'].set_color('#34495e')
        self.ax.spines['left'].set_color('white')
        self.ax.set_facecolor('#34495e')

        self.graph_canvas = FigureCanvasTkAgg(self.fig, master=graph_frame)
        self.graph_canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        self.update_graph()

    def add_to_cart(self):
        item_name = self.cart_item_var.get()
        try:
            quantity = int(self.cart_qty_var.get())
            if quantity < 1: raise ValueError
        except ValueError:
            messagebox.showerror("Invalid Quantity", "Please enter a valid positive number.")
            return
        for _ in range(quantity):
            self.customer_order_list.append(item_name)
        self.update_expected_items_status()
        
    def clear_cart(self):
        if messagebox.askyesno("Clear Cart", "Are you sure?"):
            self.customer_order_list.clear()
            self.update_expected_items_status()

    def confirm_order(self):
        if not self.customer_order_list:
            messagebox.showwarning("Empty Cart", "Cannot confirm an empty order.")
            return
        self.order_confirmed = True
        self.expected_rfids_set = self._generate_full_expected_rfid_set()
        self.update_widget_states()
        self.verification_label.config(text="Pending Scan", style='Warning.TLabel')
        self.canvas_frame.nametowidget('package_contents_label').config(text="Package Contents (Click to Place Items)", foreground="white")

    def update_widget_states(self):
        cart_state = "normal" if not self.order_confirmed else "disabled"
        config_state = "normal" if self.order_confirmed and not self.scan_mode_active else "disabled"
        scan_state = "normal" if self.order_confirmed and not self.scan_mode_active else "disabled"
        finalize_state = "normal" if self.scan_mode_active else "disabled"
        for child in self.cart_frame.winfo_children(): child.configure(state=cart_state)
        for child in self.config_frame.winfo_children(): child.configure(state=config_state)
        self.initiate_scan_button.config(state=scan_state)
        self.finalize_scan_button.config(state=finalize_state)

    def finalize_verification(self):
        scan_duration = time.time() - self.scan_start_time if self.scan_start_time else 0
        self.scan_mode_active = False
        self.update_widget_states()
        self.canvas.unbind("<ButtonPress-1>"); self.canvas.unbind("<B1-Motion>"); self.canvas.unbind("<ButtonRelease-1>")
        self.canvas.bind("<Button-1>", self.on_canvas_click)
        self.canvas.config(cursor="")
        self.canvas.delete("scanner")

        missing_rfids = self.expected_rfids_set - self.detected_rfids
        extra_rfids = self.detected_rfids - self.expected_rfids_set
        
        def get_names_from_rfids(rfid_set):
            names = [item.name for item in self.placed_items if item.rfid_tag in rfid_set]
            return Counter(names)

        missing_counts = get_names_from_rfids(missing_rfids)
        extra_counts = get_names_from_rfids(extra_rfids)

        if missing_rfids: status = "MISMATCH"
        elif extra_rfids: status = "CAUTION"
        else: status = "SUCCESS"

        self.last_verification_data = {
            "orderId": f"Custom_Order_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "verificationStatus": status,
            "scanDurationSeconds": round(scan_duration, 2),
            "metrics": {
                "expectedItemsCount": len(self.expected_rfids_set),
                "placedItemsCount": len(self.placed_items),
                "detectedItemsCount": len(self.detected_rfids),
                "missingItemsCount": len(missing_rfids),
                "extraItemsCount": len(extra_rfids),
            },
            "expectedItems": dict(Counter(self.customer_order_list)),
            "detectedItems": dict(Counter(item.name for item in self.placed_items if item.detected)),
            "missingItemsDetail": dict(missing_counts),
            "extraItemsDetail": dict(extra_counts),
        }
        self.update_metrics_panel()
        self.show_verification_popup()
    
    def show_verification_popup(self):
        data = self.last_verification_data
        popup = tk.Toplevel(self)
        popup.title("Verification Result")
        popup.geometry("450x350")
        popup.configure(bg="#34495e")
        status = data["verificationStatus"]
        if status == "SUCCESS": style = "Success.TLabel"
        elif status == "MISMATCH": style = "Error.TLabel"
        else: style = "Caution.TLabel"
        ttk.Label(popup, text=f"Status: {status}", style=style, font=('Segoe UI', 16, 'bold')).pack(pady=10, fill='x')
        details_text = ""
        if data["missingItemsDetail"]:
            missing_str = ", ".join([f"{n} (x{q})" for n, q in data["missingItemsDetail"].items()])
            details_text += f"Missing Items:\n- {missing_str}\n\n"
        if data["extraItemsDetail"]:
            extra_str = ", ".join([f"{n} (x{q})" for n, q in data["extraItemsDetail"].items()])
            details_text += f"Extra Items Found:\n- {extra_str}\n\n"
        if not details_text: details_text = "All items verified successfully."
        ttk.Label(popup, text=details_text, wraplength=400, justify="left").pack(pady=10, padx=10)
        button_frame = ttk.Frame(popup)
        button_frame.pack(side="bottom", pady=15)
        ttk.Button(button_frame, text="Save as JSON", command=self.save_results_as_json).pack(side="left", padx=10)
        ttk.Button(button_frame, text="OK", command=popup.destroy).pack(side="left", padx=10)

    def save_results_as_json(self):
        if not self.last_verification_data:
            messagebox.showerror("Error", "No verification data to save.")
            return
        filepath = filedialog.asksaveasfilename(
            defaultextension=".json", filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
            initialfile=f"verification_report_{self.last_verification_data['orderId']}.json",
            title="Save Verification Report"
        )
        if not filepath: return
        try:
            with open(filepath, 'w') as f:
                json.dump(self.last_verification_data, f, indent=4)
            messagebox.showinfo("Success", f"Report saved successfully to:\n{filepath}")
        except Exception as e:
            messagebox.showerror("Save Error", f"An error occurred while saving the file:\n{e}")

    def update_metrics_panel(self):
        data = self.last_verification_data
        if not data:
            for label in self.metrics_labels.values(): label.config(text="-")
            self.update_graph()
            return
        metrics = data["metrics"]
        self.metrics_labels["Status"].config(text=data["verificationStatus"])
        self.metrics_labels["Scan Duration"].config(text=f"{data['scanDurationSeconds']}s")
        self.metrics_labels["Items Expected"].config(text=metrics["expectedItemsCount"])
        self.metrics_labels["Items Detected"].config(text=metrics["detectedItemsCount"])
        self.metrics_labels["Items Missing"].config(text=metrics["missingItemsCount"])
        self.metrics_labels["Items Extra"].config(text=metrics["extraItemsCount"])
        self.update_graph(metrics)

    def update_graph(self, metrics=None):
        self.ax.clear()
        if metrics:
            labels = ['Expected', 'Detected', 'Missing', 'Extra']
            values = [metrics['expectedItemsCount'], metrics['detectedItemsCount'], metrics['missingItemsCount'], metrics['extraItemsCount']]
            colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12']
            self.ax.bar(labels, values, color=colors)
            self.ax.set_ylabel('Item Count', color='white')
            self.ax.set_title('Verification Summary', color='white')
        else:
            self.ax.set_title('Verification Summary (Awaiting Scan)', color='gray')
        self.fig.tight_layout()
        self.graph_canvas.draw()
        
    def initiate_scan(self):
        if not self.placed_items:
            messagebox.showwarning("Empty Package", "Please add items to the package before scanning.")
            return
        self.scan_start_time = time.time()
        self.scan_mode_active = True
        self.update_widget_states()
        self.canvas.bind("<ButtonPress-1>", self.on_scanner_press)
        self.canvas.bind("<B1-Motion>", self.on_scanner_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_scanner_release)
        self.canvas.config(cursor="tcross")
        self.draw_scanner(100, 100)
        self.update_scan_results()

    def clear_all_items(self):
        if not messagebox.askyesno("Full Reset", "This will clear all placed items AND reset the order. Continue?"):
            return
        for item in self.placed_items: self.canvas.delete(item.canvas_id); self.canvas.delete(item.text_id); self.canvas.delete(item.rfid_text_id)
        self.placed_items.clear()
        self.order_confirmed = False; self.scan_mode_active = False
        self.detected_rfids.clear(); self.expected_rfids_set.clear()
        self.item_instance_counter.clear(); self.customer_order_list.clear()
        self.canvas.delete("scanner")
        self.canvas.unbind("<B1-Motion>"); self.canvas.unbind("<ButtonRelease-1>")
        self.canvas.bind("<Button-1>", self.on_canvas_click); self.canvas.config(cursor="")
        self.update_widget_states()
        self.update_scan_results()
        self.last_verification_data = {}
        self.update_metrics_panel()
        self.canvas_frame.nametowidget('package_contents_label').config(text="Package Contents (Disabled until order is confirmed)", foreground="gray")
    
    def on_scanner_press(self, event):
        if self.scan_mode_active:
            overlapping_items = self.canvas.find_overlapping(event.x, event.y, event.x, event.y)
            if self.scanner_id and self.scanner_id in overlapping_items:
                self.drag_data["item"] = self.scanner_id
                self.drag_data["x"] = event.x
                self.drag_data["y"] = event.y

    def on_scanner_drag(self, event):
        if self.scan_mode_active and self.drag_data["item"] is not None:
            dx = event.x - self.drag_data["x"]
            dy = event.y - self.drag_data["y"]
            self.canvas.move(self.drag_data["item"], dx, dy)
            self.drag_data["x"] = event.x
            self.drag_data["y"] = event.y
            self.check_for_detected_items()

    def on_scanner_release(self, event):
        self.drag_data["item"] = None
        self.drag_data["x"] = 0
        self.drag_data["y"] = 0

    def check_for_detected_items(self):
        if not self.scanner_id: return
        scanner_coords = self.canvas.coords(self.scanner_id)
        if not scanner_coords: return
        scanner_x = (scanner_coords[0] + scanner_coords[2]) / 2
        scanner_y = (scanner_coords[1] + scanner_coords[3]) / 2
        try: scanner_range = int(self.scanner_range_var.get())
        except ValueError: scanner_range = 80
        for item in self.placed_items:
            if not item.detected:
                distance = math.sqrt((item.x - scanner_x)**2 + (item.y - scanner_y)**2)
                if distance <= scanner_range:
                    item.detected = True
                    self.detected_rfids.add(item.rfid_tag)
                    self.update_item_visual(item, detected=True)
                    self.update_scan_results()

    def update_scan_results(self):
        num_detected = len(self.detected_rfids)
        self.scanned_items_label.config(text=f"{num_detected} physical items detected")
        detected_names = [item.name for item in self.placed_items if item.detected]
        detected_counts = Counter(detected_names)
        detected_text = ", ".join([f"{name} (x{count})" for name, count in detected_counts.items()])
        self.details_scan_label.config(text=f"Detected Items: {detected_text if detected_text else 'None'}")
        self.update_expected_items_status()

    def update_expected_items_status(self):
        for widget in self.expected_items_frame.winfo_children(): widget.destroy()
        required_counts = Counter(self.customer_order_list)
        detected_names = [item.name for item in self.placed_items if item.detected]
        detected_counts = Counter(detected_names)
        ttk.Label(self.expected_items_frame, text="Order ID: Custom", style='Info.TLabel').pack(padx=5, pady=2, anchor="w", fill="x")
        for item_name, required_qty in sorted(required_counts.items()):
            detected_qty = detected_counts.get(item_name, 0)
            item_frame = ttk.Frame(self.expected_items_frame, style='TFrame')
            item_frame.pack(fill="x", padx=5, pady=1)
            ttk.Label(item_frame, text=f"{item_name} (x{required_qty})").pack(side="left", anchor="w")
            status_label = ttk.Label(item_frame, background="#34495e")
            if not self.order_confirmed: status_label.config(text="")
            elif detected_qty == 0: status_label.config(text=f"PENDING (0/{required_qty})", foreground="#f39c12")
            elif detected_qty < required_qty: status_label.config(text=f"PARTIAL ({detected_qty}/{required_qty})", foreground="#e67e22")
            else: status_label.config(text=f"DETECTED ({detected_qty}/{required_qty})", foreground="#2ecc71", font=('Segoe UI', 9, 'bold'))
            status_label.pack(side="right")
    
    def _generate_full_expected_rfid_set(self):
        full_set = set()
        temp_counter = Counter()
        for item_name in self.customer_order_list:
            temp_counter[item_name] += 1
            base_rfid = PRODUCT_DATABASE[item_name]
            unique_rfid = f"{base_rfid}-{temp_counter[item_name]}"
            full_set.add(unique_rfid)
        return full_set

    def on_canvas_click(self, event):
        if self.order_confirmed and hasattr(self, 'current_item_to_add') and self.current_item_to_add:
            x, y = event.x, event.y
            if not (self.package_x1 <= x <= self.package_x2 and self.package_y1 <= y <= self.package_y2):
                messagebox.showwarning("Out of Bounds", "Please click inside the black dashed package boundary.")
                return
            item_name, base_rfid = self.current_item_to_add
            self.item_instance_counter[item_name] += 1
            instance_count = self.item_instance_counter[item_name]
            unique_rfid = f"{base_rfid}-{instance_count}"
            new_item = Item(item_name, unique_rfid, x, y)
            self.placed_items.append(new_item)
            self.draw_item(new_item)
            self.current_item_to_add = None
            self.canvas.config(cursor="")
    
    def add_item_to_package(self):
        selected_item_name = self.item_select_var.get()
        if not selected_item_name: messagebox.showwarning("No Item Selected", "Please select an item to add."); return
        self.current_item_to_add = (selected_item_name, PRODUCT_DATABASE[selected_item_name])
        self.canvas.config(cursor="hand2")

    def draw_item(self, item):
        item.canvas_id = self.canvas.create_rectangle(item.x - item.size/2, item.y - item.size/2,
            item.x + item.size/2, item.y + item.size/2, fill="white", outline="gray", width=1)
        item.text_id = self.canvas.create_text(item.x, item.y + item.size/2 + 8, text=item.name, fill="white", font=('Segoe UI', 7))
        item.rfid_text_id = self.canvas.create_text(item.x, item.y - item.size/2 - 8, text=f"{item.rfid_tag}", fill="white", font=('Segoe UI', 6))

    def draw_scanner(self, x, y):
        self.canvas.delete("scanner")
        try: r = int(self.scanner_range_var.get())
        except ValueError: r = 80
        self.scanner_id = self.canvas.create_oval(x-r, y-r, x+r, y+r, outline="#1abc9c", width=4, tags="scanner", dash=(4, 2))
        return self.scanner_id
    
    def update_item_visual(self, item, detected=False):
        color = "#2ecc71" if detected else "white"
        outline = "darkgreen" if detected else "gray"
        self.canvas.itemconfig(item.canvas_id, fill=color, outline=outline)
        self.canvas.itemconfig(item.text_id, fill=color)
        self.canvas.itemconfig(item.rfid_text_id, fill=color)

if __name__ == "__main__":
    app = RFIDSimulationApp()
    app.mainloop()