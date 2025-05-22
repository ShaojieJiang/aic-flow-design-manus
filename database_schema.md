# Database Schema for Workflow Automation Platform

## Overview

This document outlines the database schema for our low-code workflow automation platform with AI capabilities. The schema is designed to support workflow storage, execution, user management, and AI feature integration.

## Tables

### Users

Stores user account information and authentication details.

```
Table: users
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- username: VARCHAR(255) NOT NULL UNIQUE
- email: VARCHAR(255) NOT NULL UNIQUE
- password_hash: VARCHAR(255) NOT NULL
- first_name: VARCHAR(255)
- last_name: VARCHAR(255)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- last_login: TIMESTAMP NULL
- role: ENUM('admin', 'user') DEFAULT 'user'
- is_active: BOOLEAN DEFAULT TRUE
```

### Workflows

Stores workflow definitions and metadata.

```
Table: workflows
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- description: TEXT
- created_by: INTEGER NOT NULL (FOREIGN KEY -> users.id)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- is_active: BOOLEAN DEFAULT TRUE
- is_public: BOOLEAN DEFAULT FALSE
- version: INTEGER DEFAULT 1
- tags: TEXT (JSON array of tags)
```

### WorkflowVersions

Stores different versions of workflow definitions.

```
Table: workflow_versions
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- workflow_id: INTEGER NOT NULL (FOREIGN KEY -> workflows.id)
- version: INTEGER NOT NULL
- definition: TEXT (JSON representation of workflow)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- created_by: INTEGER NOT NULL (FOREIGN KEY -> users.id)
- notes: TEXT
```

### Nodes

Stores information about available node types.

```
Table: nodes
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- type: VARCHAR(255) NOT NULL
- description: TEXT
- category: VARCHAR(255)
- icon: VARCHAR(255)
- is_core: BOOLEAN DEFAULT FALSE
- is_ai: BOOLEAN DEFAULT FALSE
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- schema: TEXT (JSON schema for node configuration)
```

### NodeCategories

Organizes nodes into categories.

```
Table: node_categories
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL UNIQUE
- description: TEXT
- icon: VARCHAR(255)
- color: VARCHAR(7)
- display_order: INTEGER DEFAULT 0
```

### Executions

Records workflow execution history.

```
Table: executions
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- workflow_id: INTEGER NOT NULL (FOREIGN KEY -> workflows.id)
- workflow_version_id: INTEGER NOT NULL (FOREIGN KEY -> workflow_versions.id)
- started_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- finished_at: TIMESTAMP NULL
- status: ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending'
- triggered_by: INTEGER (FOREIGN KEY -> users.id)
- trigger_type: ENUM('manual', 'scheduled', 'webhook', 'event')
- error_message: TEXT
```

### ExecutionLogs

Stores detailed logs for each node execution within a workflow.

```
Table: execution_logs
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- execution_id: INTEGER NOT NULL (FOREIGN KEY -> executions.id)
- node_id: VARCHAR(255) NOT NULL
- started_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- finished_at: TIMESTAMP NULL
- status: ENUM('pending', 'running', 'completed', 'failed', 'skipped') DEFAULT 'pending'
- input_data: TEXT (JSON)
- output_data: TEXT (JSON)
- error_message: TEXT
```

### Credentials

Securely stores credentials for external services.

```
Table: credentials
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- type: VARCHAR(255) NOT NULL
- data: TEXT (Encrypted JSON)
- created_by: INTEGER NOT NULL (FOREIGN KEY -> users.id)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### Variables

Stores global and workflow-specific variables.

```
Table: variables
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- value: TEXT
- type: ENUM('string', 'number', 'boolean', 'json')
- scope: ENUM('global', 'workflow')
- workflow_id: INTEGER NULL (FOREIGN KEY -> workflows.id)
- created_by: INTEGER NOT NULL (FOREIGN KEY -> users.id)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### Webhooks

Stores webhook configurations for triggering workflows.

```
Table: webhooks
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- workflow_id: INTEGER NOT NULL (FOREIGN KEY -> workflows.id)
- path: VARCHAR(255) NOT NULL
- method: ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH') DEFAULT 'POST'
- auth_enabled: BOOLEAN DEFAULT FALSE
- auth_token: VARCHAR(255)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### Schedules

Stores scheduled workflow executions.

```
Table: schedules
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- workflow_id: INTEGER NOT NULL (FOREIGN KEY -> workflows.id)
- cron_expression: VARCHAR(255) NOT NULL
- timezone: VARCHAR(255) DEFAULT 'UTC'
- is_active: BOOLEAN DEFAULT TRUE
- created_by: INTEGER NOT NULL (FOREIGN KEY -> users.id)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- last_execution: TIMESTAMP NULL
- next_execution: TIMESTAMP NULL
```

### AIModels

Stores information about available AI models for AI nodes.

```
Table: ai_models
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- provider: VARCHAR(255) NOT NULL
- model_id: VARCHAR(255) NOT NULL
- type: ENUM('llm', 'embedding', 'image', 'audio', 'agent')
- description: TEXT
- is_active: BOOLEAN DEFAULT TRUE
- configuration: TEXT (JSON)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### WorkflowTemplates

Stores pre-built workflow templates.

```
Table: workflow_templates
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(255) NOT NULL
- description: TEXT
- category: VARCHAR(255)
- definition: TEXT (JSON representation of workflow)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- is_featured: BOOLEAN DEFAULT FALSE
- tags: TEXT (JSON array of tags)
```

### AIWorkflowSuggestions

Stores AI-generated workflow suggestions.

```
Table: ai_workflow_suggestions
- id: INTEGER PRIMARY KEY AUTO_INCREMENT
- user_id: INTEGER NOT NULL (FOREIGN KEY -> users.id)
- prompt: TEXT
- suggestion: TEXT (JSON representation of suggested workflow)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- is_applied: BOOLEAN DEFAULT FALSE
- applied_at: TIMESTAMP NULL
- feedback: ENUM('positive', 'negative', 'neutral') NULL
```

## Relationships

1. A User can have many Workflows (one-to-many)
2. A Workflow can have many WorkflowVersions (one-to-many)
3. A Workflow can have many Executions (one-to-many)
4. An Execution can have many ExecutionLogs (one-to-many)
5. A User can have many Credentials (one-to-many)
6. A Workflow can have many Variables with scope='workflow' (one-to-many)
7. A Workflow can have many Webhooks (one-to-many)
8. A Workflow can have many Schedules (one-to-many)
9. A User can have many AIWorkflowSuggestions (one-to-many)

## Indexes

- users: email, username
- workflows: created_by, name
- workflow_versions: workflow_id, version
- executions: workflow_id, status
- execution_logs: execution_id, node_id
- credentials: created_by, type
- variables: name, scope, workflow_id
- webhooks: workflow_id, path
- schedules: workflow_id, next_execution
- ai_models: provider, model_id
- workflow_templates: category, tags
- ai_workflow_suggestions: user_id, created_at

## Notes

1. JSON fields are stored as TEXT to maintain database compatibility
2. Sensitive data in the credentials table is encrypted before storage
3. Workflow definitions are stored as JSON to allow for flexible workflow structures
4. Version control is implemented for workflows to track changes over time
5. The schema supports both user-created and AI-suggested workflows
