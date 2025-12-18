# Level-x - Requirements Document

## 1. Overview

Level-x is a platform for hiring digital employees (Virtual Assistant, SDR, BDR, Customer Service) that can be embedded into websites and social media platforms. These agents operate at Level 4 autonomy.

## 2. Core Modules

### 2.1. Digital Employees (Agents)

- **Types**:
  1. Virtual Assistant
  2. Sales Development Representative (SDR)
  3. Business Development Representative (BDR)
  4. Customer Service Support
- **Capabilities**:
  - Level 4 Autonomy (Autonomous operation with minimal human intervention).
  - Custom Workflows (n8n style repetitive tasks).
  - Multi-channel presence (Web, Social, Video Calls).
  - Meeting participation (Zoom, Teams, Jitsi).

### 2.2. Workspaces

- Users must belong to at least one workspace.
- Users can create multiple workspaces.
- Role-based access control (Owner, Member, etc.).
- Agents are scoped to workspaces.

### 2.3. Training

- **Channels**:
  1. Text
  2. QnA
  3. PDF
  4. Website URL
- **Knowledge Base**: Centralized knowledge management for agents.

### 2.4. Integrations

- **Social/Messaging**: WhatsApp, Slack, Messenger, Telegram.
- **Ecommerce**: Shopify, WooCommerce.
- **CRM**: Salesforce, HubSpot, Zendesk.
- **Productivity**: Google Drive, Notion.
- **Video/Meetings**: Zoom, Google Teams, Jitsi.
- **Analytics**: Google Analytics, Microsoft Clarity, Facebook Conversion API, Mixpanel.

## 3. User Interface (Frontend)

- **Workspace Management**: Switcher, Create, Settings.
- **Agent Marketplace/Creation**: Select from default types or create custom.
- **Workflow Builder**: Visual builder for agent tasks.
- **Training Interface**: Upload/Manage training data.
- **Dashboard**: Analytics and Agent status.

## 4. MVP Requirements (Tonight)

- **Focus**: Virtual Assistant Agent.
- **Features**:
  - Workspace creation and management.
  - "Virtual Assistant" available as a default agent.
  - Basic Training (Text, URL).
  - Essential Integrations (Web Widget).
  - QA Testing Setup.
